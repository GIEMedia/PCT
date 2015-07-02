using FluentMigrator;

namespace PCT.Migrations.Migrations
{
    [Migration(201502161953)]
    public class _201502161953_TableCreation : Migration
    {
        public override void Up()
        {
            this.Execute.Sql(@"
                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Category_Course_CategoryID]') AND parent_object_id = OBJECT_ID('dbo.[Course]'))
                alter table dbo.[Course]  drop constraint FK_Category_Course_CategoryID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Test_Course_TestID]') AND parent_object_id = OBJECT_ID('dbo.[Course]'))
                alter table dbo.[Course]  drop constraint FK_Test_Course_TestID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Course_Course_CourseID]') AND parent_object_id = OBJECT_ID('dbo.[Course]'))
                alter table dbo.[Course]  drop constraint FK_Course_Course_CourseID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Category_MainCategory_ParentCategoryID]') AND parent_object_id = OBJECT_ID('dbo.[Category]'))
                alter table dbo.[Category]  drop constraint FK_Category_MainCategory_ParentCategoryID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Option_Question_QuestionID]') AND parent_object_id = OBJECT_ID('dbo.[Option]'))
                alter table dbo.[Option]  drop constraint FK_Option_Question_QuestionID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Manager_Account_AccountID]') AND parent_object_id = OBJECT_ID('dbo.[Manager]'))
                alter table dbo.[Manager]  drop constraint FK_Manager_Account_AccountID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Question_QuestionProgress_ItemID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
                alter table dbo.[Progress]  drop constraint FK_Question_QuestionProgress_ItemID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_TestProgress_CourseProgress_TestProgressID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
                alter table dbo.[Progress]  drop constraint FK_TestProgress_CourseProgress_TestProgressID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Certificate_CourseProgress_CertificateID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
                alter table dbo.[Progress]  drop constraint FK_Certificate_CourseProgress_CertificateID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_CourseProgress_Account_AccountID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
                alter table dbo.[Progress]  drop constraint FK_CourseProgress_Account_AccountID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_QuestionProgress_TestProgress_ProgressID]') AND parent_object_id = OBJECT_ID('dbo.[Progress]'))
                alter table dbo.[Progress]  drop constraint FK_QuestionProgress_TestProgress_ProgressID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Question_Questioned_QuestionedID]') AND parent_object_id = OBJECT_ID('dbo.[Question]'))
                alter table dbo.[Question]  drop constraint FK_Question_Questioned_QuestionedID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Document_Section_DocumentID]') AND parent_object_id = OBJECT_ID('dbo.[Questioned]'))
                alter table dbo.[Questioned]  drop constraint FK_Document_Section_DocumentID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_Section_Course_CourseID]') AND parent_object_id = OBJECT_ID('dbo.[Questioned]'))
                alter table dbo.[Questioned]  drop constraint FK_Section_Course_CourseID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_StateCEU_Course_CourseID]') AND parent_object_id = OBJECT_ID('dbo.[StateCEU]'))
                alter table dbo.[StateCEU]  drop constraint FK_StateCEU_Course_CourseID


                if exists (select 1 from sys.objects where object_id = OBJECT_ID(N'dbo.[FK_StateLicensure_Account_AccountID]') AND parent_object_id = OBJECT_ID('dbo.[StateLicensure]'))
                alter table dbo.[StateLicensure]  drop constraint FK_StateLicensure_Account_AccountID


                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Certificate]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Certificate]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Course]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Course]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Category]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Category]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Document]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Document]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Option]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Option]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Manager]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Manager]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Progress]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Progress]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Question]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Question]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[Questioned]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[Questioned]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[StateCEU]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[StateCEU]

                if exists (select * from dbo.sysobjects where id = object_id(N'dbo.[StateLicensure]') and OBJECTPROPERTY(id, N'IsUserTable') = 1) drop table dbo.[StateLicensure]

                create table dbo.[Certificate] (
	                CertificateID UNIQUEIDENTIFIER not null,
                   [EarnedUtc] DATETIME null,
                   primary key (CertificateID)
                )

                create table dbo.[Course] (
	                CourseID UNIQUEIDENTIFIER not null,
                   [Title] NVARCHAR(255) null,
                   Status INT null,
                   [DateCreatedUtc] DATETIME null,
                   CategoryID UNIQUEIDENTIFIER null,
                   TestID UNIQUEIDENTIFIER null,
                   primary key (CourseID)
                )

                create table dbo.[Category] (
	                CategoryID UNIQUEIDENTIFIER not null,
                   Discriminator NVARCHAR(255) not null,
                   [Title] NVARCHAR(255) null,
                   ParentCategoryID UNIQUEIDENTIFIER null,
                   primary key (CategoryID)
                )

                create table dbo.[Document] (
	                DocumentID UNIQUEIDENTIFIER not null,
                   [PDFUrl] NVARCHAR(255) null,
                   [PageImageUrlFormat] NVARCHAR(255) null,
                   [PageCount] INT null,
                   primary key (DocumentID)
                )

                create table dbo.[Option] (
	                OptionID UNIQUEIDENTIFIER not null,
                   Discriminator NVARCHAR(255) not null,
                   [Text] NVARCHAR(255) null,
                   [Correct] BIT null,
                   [ImageUrl] NVARCHAR(255) null,
                   QuestionID UNIQUEIDENTIFIER null,
                   primary key (OptionID)
                )

                create table dbo.[Manager] (
	                ManagerID UNIQUEIDENTIFIER not null,
                   [Name] NVARCHAR(255) null,
                   [Email] NVARCHAR(255) null,
                   AccountID UNIQUEIDENTIFIER null,
                   primary key (ManagerID)
                )

                create table dbo.[Progress] (
	                ProgressID UNIQUEIDENTIFIER not null,
                   Discriminator NVARCHAR(255) not null,
                   [LastActivityUtc] DATETIME null,
                   Total INT null,
                   ItemID UNIQUEIDENTIFIER null,
                   TestProgressID UNIQUEIDENTIFIER null,
                   CertificateID UNIQUEIDENTIFIER null,
                   [RetriesLeft] INT null,
                   AccountID UNIQUEIDENTIFIER null,
                   primary key (ProgressID)
                )

                create table dbo.[Question] (
	                QuestionID UNIQUEIDENTIFIER not null,
                   Discriminator NVARCHAR(255) not null,
                   [QuestionText] NVARCHAR(MAX) null,
                   [CorrectResponseHeading] NVARCHAR(MAX) null,
                   [CorrectResponseText] NVARCHAR(MAX) null,
                   [Tip] NVARCHAR(255) null,
                   [SortOrder] INT null,
                   [ImageUrl] NVARCHAR(255) null,
                   [Mp4Url] NVARCHAR(255) null,
                   QuestionedID UNIQUEIDENTIFIER null,
                   primary key (QuestionID)
                )

                create table dbo.[Questioned] (
	                QuestionedID UNIQUEIDENTIFIER not null,
                   Discriminator NVARCHAR(255) not null,
                   [Title] NVARCHAR(255) null,
                   [SortOrder] INT null,
                   DocumentID UNIQUEIDENTIFIER null,
                   CourseID UNIQUEIDENTIFIER null,
                   primary key (QuestionedID)
                )

                create table dbo.[StateCEU] (
	                StateCEUID UNIQUEIDENTIFIER not null,
                   [StateAbbr] NVARCHAR(255) null,
                   [CategoryCode] NVARCHAR(255) null,
                   [Hours] DECIMAL(19,5) null,
                   CourseID UNIQUEIDENTIFIER null,
                   primary key (StateCEUID)
                )

                create table dbo.[StateLicensure] (
	                StateLicensureID UNIQUEIDENTIFIER not null,
                   [StateAbbr] NVARCHAR(255) null,
                   [Category] NVARCHAR(255) null,
                   [LicenseNum] NVARCHAR(255) null,
                   AccountID UNIQUEIDENTIFIER null,
                   primary key (StateLicensureID)
                )

                alter table dbo.[Course] 
	                add constraint FK_Category_Course_CategoryID 
	                foreign key (CategoryID) 
	                references dbo.[Category]

                alter table dbo.[Course] 
	                add constraint FK_Test_Course_TestID 
	                foreign key (TestID) 
	                references dbo.[Questioned]

                alter table dbo.[Course] 
	                add constraint FK_Course_Course_CourseID 
	                foreign key (CourseID) 
	                references dbo.[Course]

                alter table dbo.[Category] 
	                add constraint FK_Category_MainCategory_ParentCategoryID 
	                foreign key (ParentCategoryID) 
	                references dbo.[Category]

                alter table dbo.[Option] 
	                add constraint FK_Option_Question_QuestionID 
	                foreign key (QuestionID) 
	                references dbo.[Question]

                alter table dbo.[Manager] 
	                add constraint FK_Manager_Account_AccountID 
	                foreign key (AccountID) 
	                references dbo.[Account]

                alter table dbo.[Progress] 
	                add constraint FK_Question_QuestionProgress_ItemID 
	                foreign key (ItemID) 
	                references dbo.[Course]

                alter table dbo.[Progress] 
	                add constraint FK_TestProgress_CourseProgress_TestProgressID 
	                foreign key (TestProgressID) 
	                references dbo.[Progress]

                alter table dbo.[Progress] 
	                add constraint FK_Certificate_CourseProgress_CertificateID 
	                foreign key (CertificateID) 
	                references dbo.[Certificate]

                alter table dbo.[Progress] 
	                add constraint FK_CourseProgress_Account_AccountID 
	                foreign key (AccountID) 
	                references dbo.[Account]

                alter table dbo.[Progress] 
	                add constraint FK_QuestionProgress_TestProgress_ProgressID 
	                foreign key (ProgressID) 
	                references dbo.[Progress]

                alter table dbo.[Question] 
	                add constraint FK_Question_Questioned_QuestionedID 
	                foreign key (QuestionedID) 
	                references dbo.[Questioned]

                alter table dbo.[Questioned] 
	                add constraint FK_Document_Section_DocumentID 
	                foreign key (DocumentID) 
	                references dbo.[Document]

                alter table dbo.[Questioned] 
	                add constraint FK_Section_Course_CourseID 
	                foreign key (CourseID) 
	                references dbo.[Course]

                alter table dbo.[StateCEU] 
	                add constraint FK_StateCEU_Course_CourseID 
	                foreign key (CourseID) 
	                references dbo.[Course]

                alter table dbo.[StateLicensure] 
	                add constraint FK_StateLicensure_Account_AccountID 
	                foreign key (AccountID) 
	                references dbo.[Account]
            ");
        }

        public override void Down()
        {
            
        }
    }
}