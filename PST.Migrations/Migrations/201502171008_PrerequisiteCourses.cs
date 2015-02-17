using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201502171008)]
    public class _201502171008_PrerequisiteCourses : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Course_PrerequisiteCourse_PrerequisiteCourses]') AND parent_object_id = OBJECT_ID('dbo.PrerequisiteCourses'))
                alter table dbo.PrerequisiteCourses  drop constraint FK_Course_PrerequisiteCourse_PrerequisiteCourses

                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Course_Course_PrerequisiteCourses]') AND parent_object_id = OBJECT_ID('dbo.PrerequisiteCourses'))
                alter table dbo.PrerequisiteCourses  drop constraint FK_Course_Course_PrerequisiteCourses

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.PrerequisiteCourses') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.PrerequisiteCourses

                create table dbo.PrerequisiteCourses (
	                CourseID UNIQUEIDENTIFIER not null,
                   PrerequisiteCourseID UNIQUEIDENTIFIER not null
                )

                alter table dbo.PrerequisiteCourses 
	                add constraint FK_Course_PrerequisiteCourse_PrerequisiteCourses 
	                foreign key (PrerequisiteCourseID) 
	                references dbo.[Course]

                alter table dbo.PrerequisiteCourses 
	                add constraint FK_Course_Course_PrerequisiteCourses 
	                foreign key (CourseID) 
	                references dbo.[Course]
            ");
        }

        public override void Down()
        {
            
        }
    }
}