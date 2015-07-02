using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201502251254)]
    public class _201502251254_TriesLeft : Migration
    {
        public override void Up()
        {
            this.Rename.Column("RetriesLeft").OnTable("Progress").InSchema("dbo").To("TriesLeft");
        }

        public override void Down()
        {
            this.Rename.Column("TriesLeft").OnTable("Progress").InSchema("dbo").To("RetriesLeft");
        }
    }
}