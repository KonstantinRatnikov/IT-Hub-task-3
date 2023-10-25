import React, {Component} from 'react';
import {Form,Button} from 'react-bootstrap';
export class SignUp extends Component{

    constructor(props){
        super(props);
        this.state={users:[], addModalShow:false, editModalShow:false}
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        const data = {
            Username: event.target.UserId.value,
            Password: event.target.Password.value
        };
        if(event.target.RepeatPassword.value !== event.target.Password.value){
            alert("Пароли не совпадают.");
            return;
        }
        fetch('http://localhost:34840/api/UserRegistration', {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    render(){
        return(
            <div className="m-3 d-flex justify-content-center">
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="EmployeeId">
                    <Form.Label>Придумайте имя пользователя</Form.Label>
                    <Form.Control type="text" name="UserId" required 
                    placeholder="id"/>
                </Form.Group>

                <Form.Group controlId="PasswordHash">
                    <Form.Label>Придумайте пароль</Form.Label>
                    <Form.Control type="password" name="Password" required 
                    placeholder="Password"/>
                </Form.Group>

                <Form.Group controlId="PasswordHash">
                    <Form.Label>Повторите пароль</Form.Label>
                    <Form.Control type="password" name="RepeatPassword" required 
                    placeholder="Password"/>
                </Form.Group>

                <Form.Group>
                    <Button variant="primary" type="submit">
                        Зарегистрироваться
                    </Button>
                </Form.Group>
            </Form>
        </div>
        )
    }
}