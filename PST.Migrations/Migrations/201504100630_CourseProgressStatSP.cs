using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201504100630)]
    public class _201504100630_CourseProgressStatSP : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
/****** Object:  StoredProcedure [dbo].[AggregateCourseProgresses]    Script Date: 4/10/2015 12:29:49 PM ******/
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AggregateCourseProgresses')
DROP PROCEDURE [dbo].[AggregateCourseProgresses]
GO

/****** Object:  StoredProcedure [dbo].[AggregateCourseProgresses]    Script Date: 4/10/2015 12:29:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		     Prototype1 (Oleg Fridman)
-- Last Update Date: April 10, 2015
-- Description:	     Aggregates all course progresses to count completed and open courses
-- =============================================
CREATE PROCEDURE [dbo].[AggregateCourseProgresses]
AS
BEGIN
	SET NOCOUNT ON;

    SELECT Course.CourseID ID, ISNULL(CourseCompleted, 0) CourseCompleted, ISNULL(CourseInProgress, 0) CourseInProgress, ISNULL(TestCompleted, 0) TestCompleted, ISNULL(TestInProgress, 0) TestInProgress, LastActivityUtc
	    FROM Course
	    LEFT OUTER JOIN (
		    select CourseID, SUM(PassedCourse) CourseCompleted, COUNT(1) - SUM(PassedCourse) CourseInProgress, SUM(PassedTest) TestCompleted, (SELECT MAX(Val) FROM (VALUES (0), (SUM(PassedCourse) - SUM(PassedTest))) AS T(Val)) TestInProgress, MAX(LastActivityUtc) LastActivityUtc
			    from (
				    select AccountID, CourseID, MAX(PassedCourse) PassedCourse, MAX(PassedTest) PassedTest, MAX(LastActivityUtc) LastActivityUtc
					    from  (
						    select AccountID, CourseID, case when IsTest = 0 AND MAX(TotalSections) = SUM(PassedSectionOrTest) then 1 else 0 end PassedCourse, case when IsTest = 1 AND MAX(PassedSectionOrTest) > 0 then 1 else 0 end PassedTest, MAX(LastActivityUtc) LastActivityUtc
							    from (
								    select distinct AccountID, CourseID, SectionOrTestID, case when IsTest=1 then 1 else MAX(TotalSections) end TotalSections, case when count(1) = MAX(TotalQuestions) then 1 else 0 end PassedSectionOrTest, IsTest, MAX(LastActivityUtc) LastActivityUtc
									    from (
											    select cp.AccountID, cp.ItemID CourseID, cp.Total TotalSections, sp.ItemID SectionOrTestID, sp.Total TotalQuestions, qp.ItemID QuestionID, qp.LastActivityUtc, case when sp.Discriminator='TestProgress' then 1 else 0 end IsTest
												    from progress cp
												    inner join progress sp on sp.parentprogressid=cp.progressid
												    inner join progress qp on qp.ParentProgressID=sp.ProgressID
												    where cp.discriminator='CourseProgress'
											    ) questionsByAccount
											    group by AccountID, CourseID, SectionOrTestID, IsTest
								    ) sectionsByAccount
								    group by AccountID, CourseID, IsTest
						    ) courseAndTest
						    group by AccountID, CourseID
				    ) coursesByAccount
				    group by CourseID
		    ) courseProgresses
		    ON courseProgresses.CourseID=Course.CourseID
END

GO
");
            this.Execute.Sql(@"
if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_TestProgress_CourseProgress_TestProgressID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
alter table dbo.[Progress]  drop constraint FK_TestProgress_CourseProgress_TestProgressID

UPDATE tp SET ParentProgressID = cp.ProgressID FROM Progress tp
	INNER JOIN Progress cp ON cp.TestProgressID=tp.ProgressID
	WHERE tp.Discriminator='TestProgress' and cp.Discriminator='CourseProgress'
");

            this.Delete.Column("TestProgressID").FromTable("Progress").InSchema("dbo");
        }

        public override void Down()
        {
            this.Alter.Table("Progress").AddColumn("TestProgressID").AsGuid().Nullable();

            this.Execute.Sql(@"
alter table dbo.[Progress] 
	add constraint FK_TestProgress_CourseProgress_TestProgressID 
	foreign key (TestProgressID) 
	references dbo.[Progress]

UPDATE cp SET TestProgressID = tp.ProgressID FROM Progress tp
	INNER JOIN Progress cp ON cp.ProgressID=tp.ParentProgressID
	WHERE tp.Discriminator='TestProgress' and cp.Discriminator='CourseProgress'

UPDATE Progress SET ParentProgressID = null WHERE Discriminator='TestProgress'
");
        }
    }
}