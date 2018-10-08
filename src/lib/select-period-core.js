import React, { Component } from 'react';
import { Calendar } from 'ch-calendar'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import { YearField, MonthField, QuarterField, DateField } from 'material-inputfield';

import 'react-web-tabs/dist/react-web-tabs.css';

import 'material-inputfield/dist/material-inputfield.css';


class SelectPeriodCore extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dateFrom: props.dateFrom || new Date(),
            dateTo: props.dateTo || new Date()
        }
    }

    componentWillReceiveProps(nextProps) {
        (nextProps.dateFrom !== this.props.dateFrom || nextProps.dateTo !== this.props.dateTo) && this.setState({
            dateFrom: nextProps.dateFrom,
            dateTo: nextProps.dateTo
        })
    }

    _onChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
    }

    _onChangeObject = (obj) => {
        this.setState({
            ...obj
        })
    }

    _setDateTo = (date) => {
        this.setState({
            dateTo: date
        })
    }

    _setDateFrom = (date) => {
        this.setState({
            dateFrom: date
        })
    }

    _selectPeriodWithCalendar = () => {
        const dateFrom = this.state.dateFrom,
            dateTo = this.state.dateTo

        return <div style={{ height: '100%' }} className='modal-flex-row' >

            <div className='modal-flex-column' style={{
                padding: '0 5px 0 0',
                flex: 'auto'
            }} >
                <div style={{ margin: '5px 0', }} >Начало периода:</div>
                <Calendar isActive date={dateFrom} onSelect={this._setDateFrom} />
            </div>
            <div className='modal-flex-column' style={{
                borderRight: 1,
                flex: 'auto'
            }} >
                <div style={{ margin: '5px 0', }}>Конец периода:</div>
                <Calendar isActive date={dateTo} onSelect={this._setDateTo} />
            </div>
        </div>
    }

    _selectPeriodWithForm = () => <div style={{ height: '100%', justifyContent: 'space-between' }} className='modal-flex-column' >
        <YearField onSpinButtons outlined spinButtons onChangeObject={this._onChangeObject} name='year' type='number' value={this.state.dateTo} label='Год' />
        <QuarterField onSpinButtons outlined onChangeObject={this._onChangeObject} name='quarter' value={this.state.dateTo} label='Квартал' />
        <MonthField onSpinButtons onCalendarButton outlined onChangeObject={this._onChangeObject} name='month' value={this.state.dateTo} label='Месяц' />
        <DateField onSpinButtons onCalendarButton outlined onChangeObject={this._onChangeObject} name='date' value={this.state.dateTo} label='Дата' />
    </div>

    _tabs = () =>
        <Tabs
            style={{
                flex: 'auto',
                display: 'flex',
                flexDirection: 'column'

            }}
            defaultTab="one"
            onChange={(tabId) => { console.log(tabId) }}
        >
            <TabList>
                <Tab tabFor="one">Интервал</Tab>
                <Tab tabFor="two">Период</Tab>
            </TabList>

            <TabPanel
                style={{
                    flex: 'auto',
                }}
                tabId="one">
                <div
                    style={{
                        width: '100%'
                    }}
                >{this._selectPeriodWithCalendar()}</div>
            </TabPanel>
            <TabPanel style={{ flex: 'auto' }} tabId="two">
                <div style={{ flex: 'auto' }}>{this._selectPeriodWithForm()}</div>
            </TabPanel>
        </Tabs>


    _onAccepted = () => {
        this.props.onSelect && this.props.onSelect({ dateFrom: this.state.dateFrom, dateTo: this.state.dateTo })
    }

    render() {
        const dateFrom = this.state.dateFrom.toLocaleDateString(),
            dateTo = this.state.dateTo.toLocaleDateString()
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                margin: '0 8px'
            }}>
                <div style={{ margin: '5px', }}>Установлен период: с {dateFrom} по {dateTo}</div>
                {this._tabs()}
                <div style={{ justifyContent: 'flex-end', margin: '24px 0 8px 0' }} className='modal-flex-row' >
                    <a className='modal-waves-effect modal-btn-flat' onClick={() => this.props.onClose && this.props.onClose()} >Закрыть</a>
                    <a className='modal-waves-effect modal-btn-flat modal-btn-accent' onClick={this._onAccepted} >Принять</a>
                </div>
            </div>
        );
    }
}
export default SelectPeriodCore;