import { AgGridReact } from 'ag-grid-react';
import { AG_GRID_LOCALE_NL } from '@ag-grid-community/locale'
import { useEffect, useState, useContext } from 'react';
import { Context as IncidentsContext } from '../../context/incidentsContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate()
    const { state, getIncidents } = useContext(IncidentsContext);

    useEffect(() => {
        getIncidents()
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
            valueGetter: (params) => new Date(params.data.date),
            valueFormatter: (params) => {
                // display as dd-MMM-yyyy
                return params.value.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
            },
            headerName: 'Datum',
            sortable: true,
            filter: 'agDateColumnFilter',
            flex: 2,
            filterParams: {
            }
        },
        {
            valueGetter: (params) => params.data.location.street + ' ' + params.data.location.number + ', ' + params.data.location.postalCode + ', ' + params.data.location.city,
            headerName: 'Locatie',
            sortable: true,
            filter: true,
            flex: 2,
            filterParams: {
                filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
            }
        },
        {
            field: 'incidentType',
            headerName: 'Incident type',
            sortable: true,
            filter: true,
            flex: 2,
            filterParams: {
                filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
            }
        },
        {
            field: 'description',
            headerName: 'Omschrijving',
            sortable: false,
            filter: true,
            flex: 3,
            filterParams: {
                filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
            }
        }
    ])

    return (
        <div>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title">Incidenten</h3>
                    <div className="card-tools ml-auto">
                        <button type="button" className="btn btn-outline-success" onClick={() => navigate('/incidenten/aanmaken')}>Nieuw</button>
                    </div>
                </div>
                <div className="card-body">
                    {
                        state.incidents && state.incidents.length > 0 ? (
                            <div className="ag-theme-quartz" style={{ marginTop: 20 }}>
                                <AgGridReact
                                    rowData={state.incidents}
                                    columnDefs={columnDefs}
                                    pagination={true}
                                    paginationPageSize={5}
                                    domLayout='autoHeight'
                                    paginationPageSizeSelector={[5, 10, 25, 50, 100]}
                                    onRowClicked={(row) => navigate(`/incidenten/${row.data._id}`)}
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