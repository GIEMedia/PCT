using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201501282132)]
    public class _201501282132_AccountAddress : Migration
    {
        public override void Up()
        {
            this.Alter.Table("Account").AddColumn("CompanyAddress1").AsString().Nullable();
            this.Alter.Table("Account").AddColumn("CompanyAddress2").AsString().Nullable();
            this.Alter.Table("Account").AddColumn("CompanyCity").AsString().Nullable();
            this.Alter.Table("Account").AddColumn("CompanyState").AsString().Nullable();
            this.Alter.Table("Account").AddColumn("CompanyZipCode").AsString().Nullable();
            this.Alter.Table("Account").AddColumn("CompanyPhone").AsString().Nullable();
        }

        public override void Down()
        {
            
        }
    }
}