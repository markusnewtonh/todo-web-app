package org.markusnh.todo.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

/**
 * Contains the updated information for a task to be changed. A TaskRequest either carries an
 * updated task description or updated completion status.
 */
public class TaskRequest {
  @NotBlank private String description;
  @NotEmpty private boolean completedStatus;

  public TaskRequest() {
    // Default constructor
  }

  public TaskRequest(String description, boolean completedStatus) {
    this.description = description;
    this.completedStatus = completedStatus;
  }

  public String getDescription() {
    return description;
  }

  public boolean isCompletedStatus() {
    return completedStatus;
  }
}
