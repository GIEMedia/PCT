using System;
using System.Collections.Generic;

namespace PST.Api.Areas.Help.SampleGeneration
{
    public class ApiObjectGenerator
    {
        public Dictionary<Type, object> ApiObjects; 

        public ApiObjectGenerator()
        {
            //InitializeAccount();

            ApiObjects = new Dictionary<Type, object>()
            {
                //{typeof(account), this.Account},
                //{typeof(order_payment[]), new []
                //{
                //    this.OrderPayment
                //}}
            };
        }

        #region Account
        //public account Account { get; private set; }

        //private void InitializeAccount()
        //{
        //    this.Account = new account()
        //    {
        //        id = Guid.NewGuid().ToString(),
        //        first_name = "Joe",
        //        last_name = "User",
        //        username = "noreply@email.com",
        //        email = "noreply@email.com",
        //        phone = "8886667976",
        //        allow_sms = true,
        //        birth_date = DateTime.Now,
        //        gender = Gender.Male.ToString(),
        //        get_news_letters = false,
        //        sms_number = "5556667777",
        //        interests = new interests()
        //        {
        //            baseball = true,
        //            basketball = false
        //        }
        //    };
        //}

        #endregion Account
    }
}