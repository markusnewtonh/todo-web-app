package org.markusnh.todo.controller;

import java.util.List;
import org.markusnh.todo.model.Task;
import org.markusnh.todo.model.TaskRequest;
import org.markusnh.todo.repository.ResourceNotFoundException;
import org.markusnh.todo.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

@RestController
public class TodoController {
  private final TaskRepository repository;

  public TodoController(TaskRepository repository) {
    this.repository = repository;
  }

  /**
   * Returns a list of all the stored tasks.
   *
   * @return list of stored tasks
   */
  @GetMapping("/tasks")
  public List<Task> getTasks() {
    return this.repository.findAll();
  }

  /**
   * Adds a task to the task database and returns the updated list of tasks.
   *
   * @param newTask new task request containing the task description
   * @return updated list of tasks
   */
  @PostMapping("tasks/add-task")
  public List<Task> addTask(@RequestBody TaskRequest newTask) {
    int id = (int) repository.count() + 1;
    repository.insert(new Task(id, newTask.getDescription(), false));
    return repository.findAll();
  }

  /**
   * Removes the task with the given id from the list of tasks and database.
   *
   * @param id the task id that should be removed
   * @return updated list of tasks
   */
  @DeleteMapping("/tasks/{id}")
  public List<Task> removeTask(@PathVariable int id) {
    if (repository.findById(id) == null) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    repository.deleteById(id);
    return repository.findAll();
  }

  /**
   * Updates a given task's description.
   *
   * @param id task id of the task that should be updated
   * @param taskRequest task request with the new description for the given task
   * @return updated list of tasks
   */
  @PatchMapping("tasks/{id}")
  public List<Task> updateTaskDescription(
      @PathVariable int id, @RequestBody TaskRequest taskRequest) {
    if (repository.findById(id) == null) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    Task task = repository.findById(id);
    task.setDescription(taskRequest.getDescription());
    repository.save(task);
    return repository.findAll();
  }

  /**
   * Marks a given task as completed.
   *
   * @param id task id of the task that should be marked completed
   * @return updated list of tasks
   */
  @PatchMapping("/tasks/completed/{id}")
  public List<Task> updateCompleted(@PathVariable int id, @RequestBody TaskRequest taskRequest) {
    if (repository.findById(id) == null) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    Task task = repository.findById(id);
    task.setCompleted(taskRequest.isCompletedStatus());
    repository.save(task);
    return repository.findAll();
  }
}
