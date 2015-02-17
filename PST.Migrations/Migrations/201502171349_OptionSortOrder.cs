using FluentMigrator;

namespace PST.Migrations.Migrations
{
    [Migration(201502171349)]
    public class _201502171349_OptionSortOrder : Migration
    {
        public override void Up()
        {
            this.Alter.Table("Option").AddColumn("SortOrder").AsInt32().Nullable();
        }

        public override void Down()
        {
            
        }
    }
}