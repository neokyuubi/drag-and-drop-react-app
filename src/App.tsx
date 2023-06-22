import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './App.scss';

let itemId = 0;

const generateItemId = (): number => {
  itemId += 1;
  return itemId;
};

const App: React.FC = () => {
  const [leftItems, setLeftItems] = useState([
    { id: generateItemId(), text: 'Item 1', value: '' },
    { id: generateItemId(), text: 'Item 2', value: '' },
    { id: generateItemId(), text: 'Item 3', value: '' },
  ]);

  const [rightItems, setRightItems] = useState([
    { id: generateItemId(), text: 'Item 4', value: '' },
    { id: generateItemId(), text: 'Item 5', value: '' },
    { id: generateItemId(), text: 'Item 6', value: '' },
  ]);

  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === 'left' && destination.droppableId === 'right') {
      const draggedItem = leftItems[source.index];
      const updatedLeftItems = [...leftItems];
      updatedLeftItems.splice(source.index, 1);

      const updatedRightItems = [...rightItems];
      updatedRightItems.splice(destination.index, 0, draggedItem);

      setLeftItems(updatedLeftItems);
      setRightItems(updatedRightItems);
    }

    if (source.droppableId === 'right' && destination.droppableId === 'left') {
      const draggedItem = rightItems[source.index];
      const updatedRightItems = [...rightItems];
      updatedRightItems.splice(source.index, 1);

      const updatedLeftItems = [...leftItems];
      updatedLeftItems.splice(destination.index, 0, draggedItem);

      setRightItems(updatedRightItems);
      setLeftItems(updatedLeftItems);
    }
  };

  const handleInputChange = (itemId: number, value: string, list: string) => {
    if (list === 'left') {
      const updatedLeftItems = leftItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, value };
        }
        return item;
      });
      setLeftItems(updatedLeftItems);
    } else if (list === 'right') {
      const updatedRightItems = rightItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, value };
        }
        return item;
      });
      setRightItems(updatedRightItems);
    }
  };

  const handleSave = () => {
    setSavedItems(rightItems);
    setIsSaved(true);
  };

  return (
    <div className="container">
      <h1  className="border border-top-0 pb-3 mb-3">React Drag and Drop</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          <div className="col">
            <h2>Left Drop Zone</h2>
            <Droppable droppableId="left">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="drop-zone">
                  {leftItems.map((item, index) => (
                    <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="item"
                        >
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleInputChange(item.id, e.target.value, 'left')}
                          />
                           : {item.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="col">
            <h2>Right Drop Zone</h2>
            <Droppable droppableId="right">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="drop-zone">
                  {rightItems.map((item, index) => (
                    <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="item"
                        >
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleInputChange(item.id, e.target.value, 'right')}
                          />
                           : {item.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
        <button className="btn btn-primary save-btn" onClick={handleSave}>
          Save
        </button>
      </DragDropContext>
      {isSaved && (
        <div className='pt-3'>
          <h2>Table</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Text</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {savedItems.map((item) => (
                <tr key={item.id.toString()}>
                  <td>{item.id}</td>
                  <td>{item.text}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
