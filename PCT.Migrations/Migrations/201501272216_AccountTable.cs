using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201501272216)]
    public class _201501272216_AccountTable : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Account]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Account]

                create table dbo.[Account] (
                    AccountID UNIQUEIDENTIFIER not null,
                   [FirstName] NVARCHAR(255) null,
                   [LastName] NVARCHAR(255) null,
                   [Username] NVARCHAR(255) null,
                   [Email] NVARCHAR(255) null,
                   [HashedPassword] NVARCHAR(255) null,
                   [PasswordResetToken] NVARCHAR(255) null,
                   [PasswordResetTokenExpirationDate] DATETIME null,
                   [DateCreated] DATETIME null,
                   [DateLastLoggedIn] DATETIME null,
                   Status INT null,
                   AdminAccess INT null,
                   primary key (AccountID)
                )
            ");
        }

        public override void Down()
        {
            
        }
    }
}