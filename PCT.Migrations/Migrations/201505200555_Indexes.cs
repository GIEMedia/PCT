using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201505200555)]
    public class _201505200555_Indexes : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                CREATE NONCLUSTERED INDEX [Option_QuestionID] ON [dbo].[Option]
                (
	                [QuestionID] ASC
                )

                CREATE NONCLUSTERED INDEX [Question_QuestionedID] ON [dbo].[Question]
                (
	                [QuestionedID] ASC
                )
            ");
        }

        public override void Down()
        {
        }
    }
}