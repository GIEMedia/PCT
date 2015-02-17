﻿using System;
using System.Collections.Generic;
using PST.Declarations.Entities;
using PST.Declarations.Models;

namespace PST.Declarations.Interfaces
{
    public interface ICourseService
    {
        /// <summary>
        /// Gets courses the specified account already has started but not finished.
        /// </summary>
        /// <param name="accountID">ID of account</param>
        /// <returns>List of course progresses that have already been started but not yet finished.</returns>
        IEnumerable<CourseProgress> OpenCourses(Guid accountID);

        /// <summary>
        /// Gets newest coureses. Optionally specify account id to remove already started/taken courses.
        /// </summary>
        /// <param name="count">Number of courses to return.</param>
        /// <param name="accountID">Filters out already started/taken courses by this account.</param>
        /// <returns>All coureses, optionally filtered by account.</returns>
        IEnumerable<Course> NewCourses(int count = 5, Guid? accountID = null);

        /// <summary>
        /// Gets a specific course by ID.
        /// </summary>
        /// <param name="courseID">ID of course to get</param>
        /// <param name="accountID">Account to ensure prereqs met.</param>
        /// <returns>Course with specified ID. Returns null if course not found or account doesn't meet prereqs.</returns>
        Course GetCourse(Guid courseID, Guid? accountID = null);

        /// <summary>
        /// Get all courses
        /// </summary>
        /// <param name="status">Course status to filter on</param>
        /// <returns>All courses</returns>
        IEnumerable<Course> GetCourses(CourseStatus? status);
            
        /// <summary>
        /// Gets a specified test by its course's ID
        /// </summary>
        /// <param name="courseID">ID of course that the test belongs to</param>
        /// <param name="accountID">Account to ensure prereqs met.</param>
        /// <returns>Test belonging to the course with specified ID. Returns null if test not found or account doesn't meet prereqs.</returns>
        Test GetTest(Guid courseID, Guid? accountID = null);

        /// <summary>
        /// Verifies the answer(s) to a question and updates the section progress if correct.
        /// </summary>
        /// <param name="accountID">ID of account.</param>
        /// <param name="courseID">ID of course.</param>
        /// <param name="questionID">ID of question being answered.</param>
        /// <param name="selectedOptionIDs">List of selected answers.</param>
        /// <param name="correctResponseHeading">The heading to show if the answer was correct.</param>
        /// <param name="correctResponseText">The text to show if the answer was correct.</param>
        /// <returns>A boolean indicating if the answer(s) are/were correct and if so, the heading and text to show.</returns>
        bool AnswerCourseQuestion(Guid accountID, Guid courseID, Guid questionID, IList<Guid> selectedOptionIDs,
            out string correctResponseHeading, out string correctResponseText);

        /// <summary>
        /// Verifies the answer(s) to a question and updates the test progress if correct.
        /// </summary>
        /// <param name="accountID">ID of account.</param>
        /// <param name="courseID">ID of course.</param>
        /// <param name="questionID">ID of question being answered.</param>
        /// <param name="selectedOptionIDs">List of selected answers.</param>
        /// <param name="correctResponseHeading">The heading to show if the answer was correct.</param>
        /// <param name="correctResponseText">The text to show if the answer was correct.</param>
        /// <returns>A boolean indicating if the answer(s) are/were correct and if so, the heading and text to show.</returns>
        bool AnswerTestQuestion(Guid accountID, Guid courseID, Guid questionID, IList<Guid> selectedOptionIDs,
            out string correctResponseHeading, out string correctResponseText);
    }
}