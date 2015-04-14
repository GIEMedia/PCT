using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201504140409)]
    public class _201504140409_CourseDisplayTitle : Migration
    {
        public override void Up()
        {
            this.Alter.Table("Course").AddColumn("DisplayTitle").AsString().Nullable();

            this.Execute.Sql(@"UPDATE Course SET DisplayTitle = Title");
        }

        public override void Down()
        {
            this.Delete.Column("DisplayTitle").FromTable("Course").InSchema("dbo");
        }
    }
}