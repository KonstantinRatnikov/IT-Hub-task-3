import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], addModalShow: false, editModalShow: false };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            Username: event.target.User.value,
            Password: event.target.Password.value
        };
    
        fetch('http://localhost:34840/api/UserSignIn', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then((result) => {
            localStorage.setItem('token', result.Token);
            window.location.href = '/NotesList';
        });
    }

    render() {
        return (
            <div className="m-3 d-flex justify-content-center">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="EmployeeId">
                        <Form.Label>Введите имя пользователя</Form.Label>
                        <Form.Control type="text" name="User" required placeholder="id" />
                    </Form.Group>

                    <Form.Group controlId="PasswordHash">
                        <Form.Label>Введите пароль</Form.Label>
                        <Form.Control type="password" name="Password" required placeholder="Password" />
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Войти
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default SignIn;
