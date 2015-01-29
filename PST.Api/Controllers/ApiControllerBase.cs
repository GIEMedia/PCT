﻿using System;
using System.Linq.Expressions;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Core.OAuth;
using PST.Declarations.Entities;
using Constants = PST.Api.Core.Constants;

namespace PST.Api.Controllers
{
    public class ApiControllerBase : ApiController
    {
        protected readonly IEntityRepository _entityRepository;
        private readonly Lazy<UserManager<ApplicationUser>> _userManager;

        protected ApiControllerBase()
        {
        }

        protected ApiControllerBase(IEntityRepository entityRepository, Lazy<UserManager<ApplicationUser>> userManager)
        {
            _entityRepository = entityRepository;
            _userManager = userManager;
        }

        private Guid? _currentUserID;

        protected Guid CurrentUserID
        {
            get
            {
                if (!_currentUserID.HasValue)
                {
                    if (HttpContext.Current == null)
                        return Constants.TestCurrentUserID;

                    Guid currentUserID;
                    var principal = HttpContext.Current.User;
                    if (principal == null || principal.Identity == null ||
                        !Guid.TryParse(principal.Identity.GetUserId(), out currentUserID))
                        return Guid.Empty;
                    _currentUserID = currentUserID;
                }
                return _currentUserID.Value;
            }
        }

        private Account _currentAccount;

        protected Account CurrentUser
        {
            get { return _currentAccount ?? (_currentAccount = _userManager.Value.FindById(CurrentUserID.ToString())); }
        }

        protected struct SetValue<TEntity, TProperty> where TEntity : EntityBase
        {
            public Expression<Func<TEntity, TProperty>> Property { get; set; }

            public TProperty Value { get; set; }

            public Func<TEntity, bool> Condition { get; set; }
        }
    }
}