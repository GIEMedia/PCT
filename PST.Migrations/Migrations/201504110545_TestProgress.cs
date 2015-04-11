using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201504110545)]
    public class _201504110545_TestProgress : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_TestProgress_CourseProgress_TestProgressID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
    alter table dbo.[Progress]  drop constraint FK_TestProgress_CourseProgress_TestProgressID
");
            this.Alter.Table("Progress").AddColumn("TestProgressID").AsGuid().Nullable();

            this.Execute.Sql(@"
alter table dbo.[Progress] 
	add constraint FK_TestProgress_CourseProgress_TestProgressID 
	foreign key (TestProgressID) 
	references dbo.[Progress]

UPDATE cp SET TestProgressID = tp.ProgressID FROM Progress tp
	INNER JOIN Progress cp ON cp.ProgressID=tp.ParentProgressID
	WHERE tp.Discriminator='TestProgress' and cp.Discriminator='CourseProgress'
");
        }

        public override void Down()
        {
            this.Delete.Column("TestProgressID").FromTable("Progress").InSchema("dbo");
        }
    }
}