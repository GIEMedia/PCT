using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201605121439)]
    public class _201605121439_CourseVerification : Migration
    {
        public override void Up()
        {
            if (!this.Schema.Table("Progress").Column("VerificationInitials").Exists())
                this.Alter.Table("Progress").AddColumn("VerificationInitials").AsString().Nullable();
            if (!this.Schema.Table("Progress").Column("VerificationDate").Exists())
                this.Alter.Table("Progress").AddColumn("VerificationDate").AsDateTime().Nullable();
        }

        public override void Down()
        {
        }
    }
}