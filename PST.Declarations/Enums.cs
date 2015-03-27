using System;

namespace PST.Declarations
{
    [Flags]
    public enum AdminAccess
    {
        None = 0,
        System = 1,
    }

    public enum CourseStatus
    {
        Draft = 0,
        InReview = 2,
        Active = 1
    }

    public enum QuestionType
    {
        SingleImage,
        MultiImage,
        Video,
        Text
    }
}