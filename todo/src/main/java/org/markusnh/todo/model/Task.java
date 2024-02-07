package org.markusnh.todo.model;

import org.springframework.data.annotation.Id;

public class Task {
  @Id private int id;
  private String description;
  private boolean completed;

  public Task() {}

  public Task(int id, String description, boolean completed) {
    this.id = id;
    this.description = description;
    this.completed = completed;
  }

  public String getDescription() {
    return description;
  }

  public boolean isCompleted() {
    return completed;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setCompleted(boolean completed) {
    this.completed = completed;
  }
}
