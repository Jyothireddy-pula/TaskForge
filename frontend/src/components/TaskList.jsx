import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import TaskCard from "./TaskCard"

function TaskList({ tasks, onDelete, onToggle, onUpdate, onReorder, onUpload }) {
  if (tasks.length === 0) {
    return <p>No tasks yet</p>
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const reordered = Array.from(tasks)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)

    onReorder(reordered)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list">
        {(provided) => (
          <div
            className="task-grid"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      onUpdate={onUpdate}
                      onUpload={onUpload}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TaskList