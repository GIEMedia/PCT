using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201503251544)]
    public class _201503251544_DeletedColumns : Migration
    {
        public override void Up()
        {
            this.Alter.Table("Questioned").AddColumn("Deleted").AsBoolean().Nullable();
            this.Alter.Table("Question").AddColumn("Deleted").AsBoolean().Nullable();
            this.Alter.Table("Course").AddColumn("Deleted").AsBoolean().Nullable();
            this.Alter.Table("Option").AddColumn("Deleted").AsBoolean().Nullable();

            this.Execute.Sql(@"
                UPDATE [Questioned] SET Deleted = 0;
                UPDATE [Question] SET Deleted = 0;
                UPDATE [Course] SET Deleted = 0;
                UPDATE [Option] SET Deleted = 0;
                ");
        }

        public override void Down()
        {
            this.Delete.Column("Deleted").FromTable("Questioned");
            this.Delete.Column("Deleted").FromTable("Question");
            this.Delete.Column("Deleted").FromTable("Course");
            this.Delete.Column("Deleted").FromTable("Option");
        }
    }
}