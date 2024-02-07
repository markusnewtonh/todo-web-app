package org.markusnh.todo.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

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
