using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201503070141)]
    public class _201503070141_CertificateCourse : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Course_Certificate_CourseID]') AND parent_object_id = OBJECT_ID('dbo.[Certificate]'))
                alter table dbo.[Certificate]  drop constraint FK_Course_Certificate_CourseID


                alter table [Certificate] add CourseID UNIQUEIDENTIFIER null


                alter table dbo.[Certificate] 
	                add constraint FK_Course_Certificate_CourseID 
	                foreign key (CourseID) 
	                references dbo.[Course]
                ");
        }

        public override void Down()
        {
            this.Execute.Sql(@"
                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Course_Certificate_CourseID]') AND parent_object_id = OBJECT_ID('dbo.[Certificate]'))
                alter table dbo.[Certificate]  drop constraint FK_Course_Certificate_CourseID


                alter table [Certificate] drop column CourseID
                ");
        }
    }
}