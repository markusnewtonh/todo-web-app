package org.markusnh.todo.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.markusnh.todo.model.Task;
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
   * @param description description of the new task
   * @return updated list of tasks
   */
  @PostMapping("/new-task")
  public List<Task> addTask(@RequestParam @NotBlank String description) {
    // validate description? annotation?
    int id = (int) repository.count() + 1;
    repository.insert(new Task(id, description, false));
    return repository.findAll();
  }

  @PostMapping("/test-task")
  public List<Task> addTask() {
    // validate description? annotation?
    int id = (int) repository.count() + 1;
    repository.insert(new Task(id, "test", false));
    return repository.findAll();
  }

  /**
   * Removes the task with the given id from the list of tasks and database.
   *
   * @param id the task id that should be removed
   * @return updated list of tasks
   */
  @DeleteMapping("/tasks/{id}")
  public List<Task> removeTask(@PathVariable @NotEmpty String id) {
    if (!repository.existsById(id)) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    repository.deleteById(id);
    return repository.findAll();
  }

  /**
   * Updates a given task's description.
   *
   * @param id task id of the task that should be updated
   * @param newDescription new description for the given task
   * @return updated list of tasks
   */
  @PutMapping("task/{id}")
  public List<Task> updateTaskDescription(
      @PathVariable @NotEmpty String id,
      @RequestParam @NotBlank String newDescription,
      @RequestParam @NotEmpty boolean completed) {
    if (!repository.existsById(id)) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    Task task = repository.findById(id).get();
    task.setDescription(newDescription);
    repository.save(task);
    return repository.findAll();
  }

  /**
   * Marks a given task as completed.
   *
   * @param id task id of the task that should be marked completed
   * @return updated list of tasks
   */
  @PutMapping("/task/completed/{id}")
  public List<Task> markCompleted(@PathVariable @NotBlank String id) {
    if (!repository.existsById(id)) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    Task task = repository.findById(id).get();
    task.setCompleted(true);
    repository.save(task);
    return repository.findAll();
  }

  /**
   * Unmarks a given task as completed.
   *
   * @param id task id of the task that should be unmarked completed
   * @return updated list of tasks
   */
  @PutMapping("/task/uncompleted/{id}")
  public List<Task> unmarkCompleted(@PathVariable @NotBlank String id) {
    if (!repository.existsById(id)) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
    Task task = repository.findById(id).get();
    task.setCompleted(false);
    repository.save(task);
    return repository.findAll();
  }
}
