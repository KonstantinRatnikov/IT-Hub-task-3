import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
export class CreateNoteModal extends Component{
    constructor(props) {
        super(props);
        this.state = { users: [], addModalShow: false, editModalShow: false };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const token = localStorage.getItem('token');
        event.preventDefault();
        const data = {
            Title: event.target.TitleNotes.value,
            Content: event.target.ContentNotes.value
        };
        fetch('http://localhost:34840/api/Notes', {
            method: 'Post',
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


  render(){
    const { handleCloseModal } = this.props; // получаем handleCloseModal из props
    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Создание новой заметки</h5>
            </div>

            <div className="modal-body">
            <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="EmployeeId">
                        <Form.Label>Введите название заметки</Form.Label>
                        <Form.Control type="text" name="TitleNotes" required placeholder="id" />
                    </Form.Group>

                    <Form.Group controlId="PasswordHash">
                        <Form.Label>Введите содержание заметки</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={10}
                            name="ContentNotes"
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Создать
                        </Button>
                    </Form.Group>
                </Form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
