import { useState } from 'react'
import './App.css'

export interface TableData {
  date: string;
  km: string;
}

export default function App() {
  const dataString = localStorage.getItem("StepsAppData");
  const tableData: TableData[] = dataString ? JSON.parse(dataString) : [];
  const state = { date: useState(""), km: useState(""), table: useState(tableData) }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    state.date[1](e.target.value);
  }

  const onKmChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    state.km[1](e.target.value);
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingDateIndex = tableData.findIndex(item => item.date === state.date[0]);
    if (existingDateIndex === -1) {
      tableData.push({ date: state.date[0], km: state.km[0] });
    }
    else {
      tableData[existingDateIndex].km = (parseFloat(tableData[existingDateIndex].km) + parseFloat(state.km[0])).toString();
    }
    tableData.sort((a, b) => {
      const a_date = a.date.split('.').reverse().join('-');
      const b_date = b.date.split('.').reverse().join('-');
      return Date.parse(b_date) - Date.parse(a_date);
    });
    localStorage.setItem("StepsAppData", JSON.stringify(tableData));
    state.table[1](tableData);
    state.date[1]("");
    state.km[1]("");
  }

  return (
    <div className="stepsApp">
      <form id="steps" className="stepsApp_form" onSubmit={onSubmit}>
        <label className="stepsApp_label" htmlFor="date">Дата (ДД.ММ.ГГГГ)
          <input name="date" className="stepsApp_form_input" value={state.date[0]} onChange={onDateChange} />
        </label>
        <label className="stepsApp_label" htmlFor="km">Пройдено км
          <input name="km" className="stepsApp_form_input" value={state.km[0]} onChange={onKmChange} />
        </label>
        <button type="submit" className="stepsApp_form_input">OK</button>
      </form>
      <table className="stepsApp_table">
        <thead>
          <tr>
            <td className="stepsApp_table_date ">Дата (ДД.ММ.ГГГГ)</td>
            <td className="stepsApp_table_km">Пройдено км</td>
            <td className="stepsApp_table_controls">Действия</td>
          </tr>
        </thead>
        <tbody>
          {tableData ? tableData.map(item => <TableRow item={item} state={state.table} />) : null}
        </tbody>
      </table>
    </div>
  )
}


function TableRow({ item, state }: {
  item: TableData,
  state: [TableData[], React.Dispatch<React.SetStateAction<TableData[]>>]
}) {

  const deleteThis = (): void => {
    const newTable = state[0].filter(it => it.date !== item.date);
    state[1](newTable);
    localStorage.setItem("StepsAppData", JSON.stringify(newTable));
  }

  return (
    <tr>
      <td className="stepsApp_table_date ">{item.date}</td>
      <td className="stepsApp_table_km" >{item.km}</td>
      <td className="stepsApp_table_controls">
        <button type="button" className="stepsApp_button">✎</button>
        <button type="button" className="stepsApp_button" onClick={deleteThis}>✘</button>
      </td>
    </tr>
  )
}
