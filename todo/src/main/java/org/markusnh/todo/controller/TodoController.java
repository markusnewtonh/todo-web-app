package org.markusnh.todo.controller;

import org.markusnh.todo.model.Task;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
  public class TodoController {
//  private  db;
  private List<Task> tasks; // alt+ins for gen constructor



  /**
   * Returns a list of all the stored tasks.
   * @return list of stored tasks
   */
  @GetMapping("/todo")
  public List<Task> getTasks() {
    return
  }

  /**
   * Adds a task to the task database and returns the updated list of tasks.
   * @param description description of the new task
   * @return updated list of tasks
   */
  public List<Task> addTask(String description) {
    // create new task
    // add to db
    // return new list
  }

  /**
   * Removes the task with the given id from the list of tasks and database.
   * @param id the task id that should be removed
   * @return updated list of tasks
   */
  public List<Task> removeTask(int id) {

  }

  /**
   * Updates a given task's description.
   * @param id task id of the task that should be updated
   * @param newDescription new description for the given task
   * @return updated list of tasks
   */
  public List<Task> updateTaskDescription(int id, String newDescription) {

  }

  /**
   * Marks a given task as completed.
   * @param id task id of the task that should be marked completed
   * @return updated list of tasks
   */
  public List<Task> markCompleted(int id) {

  }


  /**
   * Unmarks a given task as completed.
   * @param id task id of the task that should be unmarked completed
   * @return updated list of tasks
   */
  public List<Task> unmarkCompleted(int id) {

  }
}
