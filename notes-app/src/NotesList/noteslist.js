import React, { Component } from 'react';
import { CreateNoteModal } from './CreateNoteModal';
import { EditNoteModal } from './EditNoteModal';
export class NotesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            token: localStorage.getItem('token'), // получаем значение токена из localStorage
            notesData: [], // добавленное состояние для хранения заметок
            showCreateModal: false,
            showEditModal: false, 
            selectedNote: null //
        };
    }

    componentDidMount() {
        const { token } = this.state; // получаем значение токена из состояния
        if (token) {
          fetch('http://localhost:34840/api/Notes', {
            method: 'Get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.state.token}`
            }
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            this.setState({ notesData: data });
          })
          .catch(error => {
            // Обработка ошибок
            console.error('Ошибка при запросе:', error);
          });
        }
      }
      renderTableData() {
        if (this.state.notesData && this.state.notesData.length > 0) {
          return this.state.notesData.map((note, index) => {
            const { note_id, title, content, timestamp } = note;
            return (
              <tr key={note_id}>
                <td>{title}</td>
                <td>{content}</td>
                <td>{timestamp}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => this.handleEdit(note_id)}>Редактировать</button>
                  <button className="btn btn-danger" onClick={() => this.handleDelete(note_id)}>Удалить</button>
                </td>
              </tr>
            );
          });
        } else {
          return <tr><td colSpan="5">No data found</td></tr>;
        }
      }
    
      handleEdit = (note_id) => {
        // Логика обработки редактирования заметки
        console.log(`Редактирование заметки с идентификатором ${note_id}`);
        const selectedNote = this.state.notesData.find(note => note.note_id === note_id);
        this.setState({ selectedNote });
        this.setState({ showEditModal: true });

        console.log(selectedNote.title);
      };
    
      handleDelete = (note_id) => {

        // Логика обработки удаления заметки
        console.log(`Удаление заметки с идентификатором ${note_id}`);
          fetch('http://localhost:34840/api/Notes/'+note_id,{
              method:'DELETE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
              }
          })
          .then(res => res.json())
          .then((result) => {
              // Перезагрузка страницы после успешного удаления
              window.location.reload();
          })
          .catch((error) => {
              console.error('Error:', error);
          });
    };
      handleCreateNote = () => {
        this.setState({ showCreateModal: true });
      };
    
      handleCloseModal = () => {
        this.setState({ showCreateModal: false });
        this.setState({ showEditModal: false });
      };
      
      render() {
        return (
          <div className="m-3">
            <button className="btn btn-success mb-3" onClick={this.handleCreateNote}>Создать новую заметку</button>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>{this.renderTableData()}</tbody>
            </table>
            {this.state.showCreateModal && (
          <CreateNoteModal handleCloseModal={this.handleCloseModal} />
          
        )}
          {this.state.showEditModal && (
          <EditNoteModal
            handleCloseModal={this.handleCloseModal}
            selectedNote={this.state.selectedNote}
          />
        )}
          </div>
        );
      }
}