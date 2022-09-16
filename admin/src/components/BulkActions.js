import React, { useState } from "react";
import { Box, Flex, Button } from "@strapi/design-system/";
import ConfirmationDialog from "./ConfirmationDialog";

const BulkActions = ({ selectedRepos, bulkCreateAction, bulkDeleteAction }) => {
  const reposWithoutProjects = selectedRepos.filter((repo) => !repo.projectId);
  const reposWithProjects = selectedRepos.filter((repo) => repo.projectId);
  const projectsToBeCreated = reposWithoutProjects.length;
  const projectsToBeDeleted = reposWithProjects.length;
  const projectIdsToDelete = reposWithProjects.map((repo) => repo.projectId);
  const [dialogVisible, setDialogVisible] = useState(false);
  return (
    <Box paddingBottom={4}>
      <Flex>
        {projectsToBeCreated > 0 && (
          <Box paddingLeft={2}>
            <Button
              size="S"
              variant="success-light"
              onClick={() => bulkCreateAction(reposWithoutProjects)}
            >
              {projectsToBeCreated > 1
                ? `Create ${projectsToBeCreated} projects`
                : `Create ${projectsToBeCreated} project`}
            </Button>
          </Box>
        )}
        {projectsToBeDeleted > 0 && (
          <Box paddingLeft={2}>
            <Button
              size="S"
              variant="danger-light"
              onClick={() => setDialogVisible(true)}
            >
              {projectsToBeDeleted > 1
                ? `Delete ${projectsToBeDeleted} projects`
                : `Delete ${projectsToBeDeleted} project`}
            </Button>
          </Box>
        )}
      </Flex>
      <ConfirmationDialog
        visible={dialogVisible}
        message="Are you sure you want to delete this/these project(s)?"
        onClose={() => setDialogVisible(false)}
        onConfirm={() => {
          bulkDeleteAction(projectIdsToDelete);
          setDialogVisible(false);
        }}
      />
    </Box>
  );
};

export default BulkActions;
