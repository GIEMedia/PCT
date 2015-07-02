using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201501290811)]
    public class _201501290811_AccountCompanyName : Migration
    {
        public override void Up()
        {
            this.Alter.Table("Account").AddColumn("CompanyName").AsString().Nullable();
        }

        public override void Down()
        {
            
        }
    }
}