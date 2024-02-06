package org.markusnh.todo.repository;

import org.markusnh.todo.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository<Task, String> {
  public Task findById(int id);
}
