using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201605121445)]
    public class _201605121445_CourseActiveTime : Migration
    {
        public override void Up()
        {
            if (!this.Schema.Table("Progress").Column("ActiveTime").Exists())
                this.Alter.Table("Progress").AddColumn("ActiveTime").AsInt32().Nullable();
        }

        public override void Down()
        {
        }
    }
}