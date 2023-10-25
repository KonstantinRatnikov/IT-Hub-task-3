import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

export class EditNoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      addModalShow: false,
      editModalShow: false,
      title: '',
      content: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const token = localStorage.getItem('token');
    event.preventDefault();
    const data = {
        NoteId: this.props.selectedNote.note_id,
        Title: event.target.TitleNotes.value,
        Content: event.target.ContentNotes.value
    };
    fetch('http://localhost:34840/api/Notes', {
        method: 'Put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((result) => {
        // Перезагрузка страницы после успешного создания заметки
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


  render() {
    const { selectedNote, handleCloseModal } = this.props;
    return (
        
      <div
        className="modal"
        tabIndex="-1"
        role="dialog"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Редактирование заметки</h5>
            </div>

            <div className="modal-body">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="EmployeeId">
                  <Form.Label>Название заметки</Form.Label>
                  <Form.Control
                    type="text"
                    name="TitleNotes"
                    required
                    defaultValue={selectedNote.title}
                    />
                </Form.Group>

                <Form.Group controlId="PasswordHash">
                  <Form.Label>Содержание заметки</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    name="ContentNotes"
                    required
                    defaultValue={selectedNote.content}
                    />
                </Form.Group>

                <Form.Group>
                  <Button variant="primary" type="submit">
                    Сохранить
                  </Button>
                </Form.Group>
              </Form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
