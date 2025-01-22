import { AgGridReact } from 'ag-grid-react';
import { AG_GRID_LOCALE_NL } from '@ag-grid-community/locale'
import { useEffect, useState, useContext } from 'react';
import { Context as PersonsContext } from '../../context/personsContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate()
    const { state, getPersons } = useContext(PersonsContext);

    useEffect(() => {
        getPersons()
    }, [])

    const [columnDefs] = useState([
        {
            field: '_id',
            headerName: 'ID',
            sortable: false,
            filter: false,
            flex: 1,
            filterParams: {
                filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
            }
        },
        {
            field: 'name',
            headerName: 'Naam',
            sortable: true,
            filter: true,
            flex: 2,
            filterParams: {
                filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
            }
        },
        {
            field: 'position',
            headerName: 'Functie',
            sortable: true,
            filter: true,
            flex: 2,
            filterParams: {
                filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
            }
        },
        {
            field: 'active',
            headerName: 'Actief',
            sortable: true,
            filter: false,
            flex: 1,
            filterParams: {
                filterOptions: ['equals', 'notEquals']
            }
        }
    ])

    return (
        <div>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title">Personen</h3>
                    <div className="card-tools ml-auto">
                        <button type="button" className="btn btn-outline-success" onClick={() => navigate('/personen/aanmaken')}>Nieuw</button>
                    </div>
                </div>
                <div className="card-body">
                    {
                        state.persons && state.persons.length > 0 ? (
                            <div className="ag-theme-quartz" style={{ marginTop: 20 }}>
                                <AgGridReact
                                    rowData={state.persons}
                                    columnDefs={columnDefs}
                                    pagination={true}
                                    paginationPageSize={5}
                                    domLayout='autoHeight'
                                    paginationPageSizeSelector={[5, 10, 25, 50, 100]}
                                    onRowClicked={(row) => navigate(`/personen/${row.data._id}`)}
                                    localeText={AG_GRID_LOCALE_NL}
                                />
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}

export default Index;