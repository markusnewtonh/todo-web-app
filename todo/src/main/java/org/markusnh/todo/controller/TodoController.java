package org.markusnh.todo.controller;

import java.util.List;
import org.markusnh.todo.model.Task;
import org.markusnh.todo.model.TaskRequest;
import org.markusnh.todo.service.TaskService;
import org.springframework.web.bind.annotation.*;

@RestController
public class TodoController {
  private final TaskService taskService;

  public TodoController(TaskService taskService) {
    this.taskService = taskService;
  }

  /**
   * Returns a list of all the stored tasks.
   *
   * @return list of stored tasks
   */
  @GetMapping("/tasks")
  public List<Task> getTasks() {
    return taskService.getTasks();
  }

  /**
   * Adds a task to the task database and returns the updated list of tasks.
   *
   * @param taskRequest task request containing a task description
   * @return appended list of tasks
   */
  @PostMapping("/tasks")
  public List<Task> addTask(@RequestBody TaskRequest taskRequest) {
    return taskService.createTask(taskRequest.getDescription());
  }

  /**
   * Removes the task with the given id from the list of tasks and from database.
   *
   * @param id the task id that should be removed
   * @return updated list of tasks
   */
  @DeleteMapping("/tasks/{id}")
  public List<Task> removeTask(@PathVariable int id) {
    return taskService.removeTask(id);
  }

  /**
   * Updates a given task's description.
   *
   * @param id task id of the task that should be updated
   * @param taskRequest task request with the new description for the given task
   * @return updated list of tasks
   */
  @PatchMapping("/tasks/{id}")
  public List<Task> updateTaskDescription(
      @PathVariable int id, @RequestBody TaskRequest taskRequest) {
    return taskService.updateTaskDescription(id, taskRequest.getDescription());
  }

  /**
   * Toggles the completion status of a given task.
   *
   * @param id task id of the task that should be marked completed
   * @param taskRequest task request with the new completion status
   * @return updated list of tasks
   */
  @PatchMapping("/tasks/completed/{id}")
  public List<Task> toggleCompletedStatus(
      @PathVariable int id, @RequestBody TaskRequest taskRequest) {
    return taskService.toggleCompletedStatus(id, taskRequest.isCompletedStatus());
  }
}
