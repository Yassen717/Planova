'use client';

import { useState, useCallback } from 'react';

export interface UseDragAndDropOptions<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  onMove?: (itemId: string, newStatus: string) => Promise<void>;
}

export interface UseDragAndDropReturn {
  draggedItem: string | null;
  dragOverItem: string | null;
  handleDragStart: (itemId: string) => void;
  handleDragEnter: (itemId: string) => void;
  handleDragEnd: () => void;
  handleDrop: (targetStatus: string) => Promise<void>;
  isDragging: (itemId: string) => boolean;
}

/**
 * Custom hook for drag and drop functionality (for Kanban board)
 */
export function useDragAndDrop<T extends { id: string }>(
  options: UseDragAndDropOptions<T>
): UseDragAndDropReturn {
  const { items, onReorder, onMove } = options;
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = useCallback((itemId: string) => {
    setDraggedItem(itemId);
  }, []);

  const handleDragEnter = useCallback((itemId: string) => {
    setDragOverItem(itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  const handleDrop = useCallback(
    async (targetStatus: string) => {
      if (!draggedItem) return;

      try {
        // Call the onMove callback if provided
        if (onMove) {
          await onMove(draggedItem, targetStatus);
        }

        // Reorder items locally (optimistic update)
        const draggedIndex = items.findIndex((item) => item.id === draggedItem);
        const dragOverIndex = dragOverItem
          ? items.findIndex((item) => item.id === dragOverItem)
          : -1;

        if (draggedIndex !== -1) {
          const newItems = [...items];
          const [removed] = newItems.splice(draggedIndex, 1);
          
          if (dragOverIndex !== -1) {
            newItems.splice(dragOverIndex, 0, removed);
          } else {
            newItems.push(removed);
          }

          onReorder(newItems);
        }
      } catch (error) {
        console.error('Error moving item:', error);
        // Rollback would happen here if needed
      } finally {
        handleDragEnd();
      }
    },
    [draggedItem, dragOverItem, items, onMove, onReorder, handleDragEnd]
  );

  const isDragging = useCallback(
    (itemId: string) => draggedItem === itemId,
    [draggedItem]
  );

  return {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
    isDragging,
  };
}
