package org.markusnh.todo.service;

import java.util.List;
import org.markusnh.todo.model.Task;
import org.markusnh.todo.repository.ResourceNotFoundException;
import org.markusnh.todo.repository.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
  private final TaskRepository repository;

  public TaskService(TaskRepository repository) {
    this.repository = repository;
  }

  public List<Task> getTasks() {
    return repository.findAll();
  }

  public List<Task> createTask(String taskDescription) {
    int id = (int) repository.count() + 1;
    repository.insert(new Task(id, taskDescription, false));
    return repository.findAll();
  }

  public List<Task> removeTask(int id) {
    validateTaskId(id);
    repository.deleteById(id);
    return repository.findAll();
  }

  public List<Task> updateTaskDescription(int id, String newDescription) {
    validateTaskId(id);
    Task task = repository.findById(id);
    task.setDescription(newDescription);
    repository.save(task);
    return repository.findAll();
  }

  public List<Task> toggleCompletedStatus(int id, boolean newCompletionStatus) {
    validateTaskId(id);
    Task task = repository.findById(id);
    task.setCompleted(newCompletionStatus);
    repository.save(task);
    return repository.findAll();
  }

  private void validateTaskId(int id) {
    if (!repository.existsById(id)) {
      throw new ResourceNotFoundException("Task with id: " + id + "does not exist.");
    }
  }
}
