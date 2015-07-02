using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201504111149)]
    public class _201504111149_OptionProgress : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
update t set title=c.Title
	from questioned t
	inner join course c on c.testid=t.questionedid
	where t.discriminator='test' and t.title is null
");
            this.Alter.Table("Progress").AddColumn("Attempt").AsInt32().Nullable();
        }

        public override void Down()
        {
            this.Delete.Column("Attempt").FromTable("Progress").InSchema("dbo");
        }
    }
}