import React, { Component } from "react"
import { Form, FormGroup, FormFeedback, Button, Input} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateWindow from '../Images/BattleWindow.png'
import {createPlayer, checkPlayerName} from '../Utilities/ServerEndpoints'
import CharacterBuilder from '../CharacterCreator/CharacterBuilder'


class CreatePlayer extends Component {


constructor(props){
 super()   
    this.state = {
        playerDetails: {
            name: "",
            STR: 0,
            INT: 0,
            STM: 0,
            STL: 0,
            givenPoints: 10, 
        },
        nameInvalid: false,
        pointsInvalid: false,
    }
}

onChange = (e) => {
    var player = this.state.playerDetails;
    player.name = e.target.value;
    this.setState({playerDetails: player})
}

plusMinus = (area, direction) => {
    var player = this.state.playerDetails
    console.log(this.refs.playerProfile.current.getSpriteProfile())
    if(player.givenPoints > 0)
    {
        if(direction === "add")
        {
            player.givenPoints = player.givenPoints - 1
            player[area] = player[area] + 1
        }
        else
        {
            if(player[area] === 0)
            {

            }
            else
            {
            player.givenPoints = player.givenPoints + 1
            player[area] = player[area] - 1
            }
        }

    }
    else
    {
        if(direction === "minus")
        {
            if(player[area] === 0)
            {

            }
            else
            {
            player.givenPoints = player.givenPoints + 1
            player[area] = player[area] - 1
            }
        }
    }

    this.setState({playerDetails: player})

}

setNameInvalid = () => {
    this.setState({nameInvalid: true})
    setTimeout(() => {
    this.setState({nameInvalid: false})
    }, 2000)
}

setPointsInvalid = () => {
    this.setState({pointsInvalid: true})
    setTimeout(() => {
    this.setState({pointsInvalid: false})
    }, 2000)
}

createNewPlayer = () => {
    var player = this.state.playerDetails
    if(player.givenPoints > 0)
    {
        this.setPointsInvalid()
    }
    else
    {
    checkPlayerName(player.name).then( response => {
        console.log(response)
        if(response === "already exists")
        {
            this.setNameInvalid()
        }
    })
    }
}

plusMinusRender = (stat) => {
    return(
        <div className="PlusMinus" style={{display: "flex"}}>
        <div style={{marginRight: 5}} onClick={() => this.plusMinus(stat, "add")}>
            <FontAwesomeIcon icon="plus" />
        </div>
        {this.state.playerDetails[stat]}
        <div style={{marginLeft: 5}} onClick={() => this.plusMinus(stat, "minus")}>
            <FontAwesomeIcon icon="minus" />
        </div>
        </div>    
        )
}

displayError = () => {
    if(this.state.pointsInvalid === true)
    {
        return "flex"
    }
    else
    {
        return "none"
    }
}


render()
{
    console.log(this.state.playerDetails)
    return(
        <div className="createPlayerMain">
        <img src={CreateWindow} width={1260} height={900}></img>
        <Form>
            <FormGroup className="Characterselect">
            <CharacterBuilder ref="playerProfile"/>
            </FormGroup>
            <FormGroup className="Playerinput">
            Player Name: <Input invalid={this.state.nameInvalid} onChange={e => this.onChange(e)} type="playername" name="playername" id="playername" placeholder="Enter Player name"></Input>
            <FormFeedback>Name Exists</FormFeedback>
            </FormGroup>
            <FormGroup className="givePoints">
            <div>{this.state.playerDetails.givenPoints} Points</div>
            <div>{this.plusMinusRender("STR")} STR</div>
            <div>{this.plusMinusRender("INT")} INT</div>
            <div>{this.plusMinusRender("STM")} STM</div>
            <div>{this.plusMinusRender("STL")} STL</div>
            </FormGroup>
            <FormGroup className="CreatePlayerSaveB" >
            <Button invalid={true}    onClick={this.createNewPlayer} className="CreatePlayerSaveB">Save</Button>
            <div style={{transform: "translate(340px, -1010px)", display: this.displayError(), color: "red", fontSize: "25px"}} >Please use all points</div>
            </FormGroup>
        </Form>
        </div>
    )
}



}

export default CreatePlayer