using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201605312035)]
    public class _201605312035_StateCEUs : Migration
    {
        public override void Up()
        {
            if (!this.Schema.Table("StateCEU").Column("ActivityID").Exists())
                this.Alter.Table("StateCEU").AddColumn("ActivityID").AsString().Nullable();

            if (!this.Schema.Table("StateCEU").Column("ActivityType").Exists())
                this.Alter.Table("StateCEU").AddColumn("ActivityType").AsString().Nullable();
        }

        public override void Down()
        {
        }
    }
}