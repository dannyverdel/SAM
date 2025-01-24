import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { Context as IncidentsContext } from "../../context/incidentsContext";
import { Context as PersonsContext } from "../../context/personsContext";
import { Context as ResourcesContext } from "../../context/resourcesContext";
import Swal from 'sweetalert2'
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { state: incidentsState, getIncident, updateIncident, addIncident } = useContext(IncidentsContext);
    const { state: personsState, getPersons } = useContext(PersonsContext);
    const { state: resourcesState, getResources } = useContext(ResourcesContext);

    const [readOnly, setReadOnly] = useState(true);
    const [incident, setIncident] = useState({});

    const [newPerson, setNewPerson] = useState({ person: '', capacity: '' });
    const [newResource, setNewResource] = useState('');
    const [newLesson, setNewLesson] = useState('');

    const incidentTypes = ['Brandgerelateerd - Woningbrand', 'Brandgerelateerd - Voertuigbrand', 'Brandgerelateerd - Natuurbrand', 'Brandgerelateerd - Schoorsteenbrand', 'Brandgerelateerd - Afvalbrand', 'Ongevallen - Verkeersongeval (met slachtoffers)', 'Ongevallen - Treinongeval', 'Ongevallen - Val van hoogte', 'Technische Hulpverlening - Gaslek zonder ontbranding', 'Technische Hulpverlening - Wateroverlast', 'Technische Hulpverlening - Dierenredding', 'Medische Incidenten - Reanimatie', 'Medische Incidenten - CO-vergiftiging', 'Medische Incidenten - Verdrinking', 'Evacuaties - Evacuatie door brand', 'Evacuaties - Explosiegevaar evacuatie', 'Incidenten met gevaarlijke stoffen - Asbestincident', 'Incidenten met gevaarlijke stoffen - Gasexplosie', 'Overig - Stormschade', 'Overig - Oefenincident']

    useEffect(() => {
        getPersons()
        getResources()
        if (id != 'aanmaken') {
            getIncident(id);
        } else {
            setIncident({ active: true, location: { country: 'Nederland' }, deployedPersonel: [], deployedResources: [], result: {}, lessonsLearned: [] });
        }
    }, []);

    useEffect(() => {
        getPersons()
        getResources()
        if (incidentsState.incident && id != 'aanmaken') {
            setIncident(incidentsState.incident);
        } else {
            setReadOnly(false);
        }
    }, [incidentsState.incident]);

    const onSave = async () => {
        Swal.fire({
            title: 'Weet je het zeker?',
            text: 'Weet je zeker dat je dit wilt opslaan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ja, opslaan'
        }).then((result) => {
            if (result.isConfirmed) {
                if (!incident.date) {
                    Swal.fire({
                        title: 'Vul alle velden in',
                        text: 'Vul alle velden in om dit incident te kunnen opslaan',
                        icon: 'warning',
                        showConfirmButton: true,
                        confirmButtonColor: '#007bff'
                    }).then(() => {
                        return;
                    })
                } else {
                    if (incident._id) {
                        updateIncident(id, incident, () => {
                            Swal.fire({
                                title: 'Incident opgeslagen',
                                text: 'Dit incident is succesvol opgeslagen',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true
                            }).then(() => {
                                setReadOnly(true)
                            })
                        });
                    } else {
                        addIncident(incident, () => {
                            Swal.fire({
                                title: 'Incident opgeslagen',
                                text: 'Dit incident is succesvol opgeslagen',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true
                            }).then(() => {
                                setReadOnly(true)
                            })
                        })
                    }
                }
            }
        })
    }

    return (
        <div>
            {
                incident && incident.location && incident.result ? (
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3>{incident.type}</h3>
                            <div className="card-tools ml-auto">
                                <button className={`btn btn-outline-${readOnly ? 'warning' : 'success'} mr-2`} onClick={() => {
                                    if (readOnly) {
                                        setReadOnly(false);
                                    } else {
                                        onSave();
                                    }
                                }}>{readOnly ? 'Wijzigen' : 'Opslaan'}</button>
                                {
                                    id == 'aanmaken' ? null : (!readOnly ? <button className="btn btn-outline-secondary mr-2" onClick={() => setReadOnly(true)}>Annuleren</button> : null)
                                }
                                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Terug</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <label>Datum:</label>
                            <Flatpickr data-enable-time value={incident.date} options={{ dateFormat: 'd-m-Y H:i', enableTime: true }} className="form-control" onChange={(date) => setIncident({ ...incident, date: date[0] })} disabled={readOnly} />
                            <br />
                            <label>Gealarmeerd op:</label>
                            <Flatpickr data-enable-time value={incident.timeAlerted} options={{ dateFormat: 'd-m-Y H:i', enableTime: true }} className="form-control" onChange={(date) => setIncident({ ...incident, timeAlerted: date[0] })} disabled={readOnly} />
                            <br />
                            <label>Aangekomen op kazerne:</label>
                            <Flatpickr data-enable-time value={incident.timeArrivedAtFireHouse} options={{ dateFormat: 'd-m-Y H:i', enableTime: true }} className="form-control" onChange={(date) => setIncident({ ...incident, timeArrivedAtFireHouse: date[0] })} disabled={readOnly} />
                            <br />
                            <label>Aangekomen op locatie:</label>
                            <Flatpickr data-enable-time value={incident.timeArrivedAtLocation} options={{ dateFormat: 'd-m-Y H:i', enableTime: true }} className="form-control" onChange={(date) => setIncident({ ...incident, timeArrivedAtLocation: date[0] })} disabled={readOnly} />
                            <br />
                            <label>Vertrokken van locatie:</label>
                            <Flatpickr data-enable-time value={incident.timeDepartureFromLocation} options={{ dateFormat: 'd-m-Y H:i', enableTime: true }} className="form-control" onChange={(date) => setIncident({ ...incident, timeDepartureFromLocation: date[0] })} disabled={readOnly} />
                            <br />
                            <label>Locatie:</label>
                            <div className="row">
                                <div className="col-8">
                                    <input type='text' className="form-control" value={incident.location.street} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, location: { ...location, street: e.target.value } })} placeholder="Straat" />
                                </div>
                                <div className="col-4">
                                    <input type='text' className="form-control" value={incident.location.number} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, location: { ...location, number: e.target.value } })} placeholder="Nummer" />
                                </div>
                            </div>
                            <br />
                            <input type='text' className="form-control" value={incident.location.postalCode} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, location: { ...location, postalCode: e.target.value } })} placeholder="Postcode" />
                            <br />
                            <input type='text' className="form-control" value={incident.location.city} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, location: { ...location, city: e.target.value } })} placeholder="Plaats" />
                            <br />
                            <input type='text' className="form-control" value={incident.location.country} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, location: { ...location, country: e.target.value } })} placeholder="Land" />
                            <br />
                            <label>Incident details:</label><br />
                            <label>Bron:</label>
                            <input type="text" className="form-control" value={incident.source} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, source: e.target.value })} />
                            <br />
                            <label>Type:</label>
                            <select className="form-control" value={incident.incidentType} disabled={readOnly} onChange={(e) => setIncident({ ...incident, incidentType: e.target.value })}>
                                <option value=''>Selecteer een type</option>
                                {
                                    incidentTypes.map((type, index) => {
                                        return <option key={index} value={type}>{type}</option>
                                    })
                                }
                            </select>
                            <br />
                            <label>Oorzaak:</label>
                            <input type="text" className="form-control" value={incident.cause} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, cause: e.target.value })} />
                            <br />
                            <label>Omschrijving:</label>
                            <textarea className="form-control" value={incident.description} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, description: e.target.value })} />
                            <br />
                            <label>Ingezette collega's</label>
                            {
                                incident.deployedPersonel && incident.deployedPersonel.map((deployedPerson, index) => {
                                    return (
                                        <div key={index} className="row mb-4">
                                            <div className={`col-${readOnly ? '8' : '7'}`}>
                                                <select className="form-control" value={deployedPerson.person._id} readOnly={true} disabled={true} onChange={(e) => setIncident({ ...incident, deployedPersonel: incident.deployedPersonel.map((p, i) => i === index ? { ...p, person: e.target.value } : p) })}>
                                                    <option value=''>Selecteer een collega</option>
                                                    {
                                                        personsState.persons.map((person, personIndex) => {
                                                            return <option key={personIndex} value={person._id}>{person.name} - {person.position}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-4">
                                                <input type="text" className="form-control" value={deployedPerson.capacity} readOnly={true} onChange={(e) => setIncident({ ...incident, deployedPersonel: incident.deployedPersonel.map((p, i) => i === index ? { ...p, capacity: e.target.value } : p) })} />
                                            </div>
                                            {
                                                !readOnly ? (
                                                    <div className="col-1">
                                                        <button className="btn form-control btn-outline-danger" onClick={() => {
                                                            setIncident({ ...incident, deployedPersonel: incident.deployedPersonel.filter((p, i) => p.person !== deployedPerson.person) })
                                                        }}>-</button>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    )
                                })
                            }
                            {/* Add person to incident */}
                            {
                                !readOnly ? (
                                    <div className="row">
                                        <div className="col-7">
                                            <select className="form-select" value={newPerson.person} onChange={(e) => setNewPerson({ ...newPerson, person: e.target.value })}>
                                                <option value=''>Selecteer een collega</option>
                                                {
                                                    personsState.persons.map((person, personIndex) => {
                                                        return <option key={personIndex} value={person._id}>{person.name} - {person.position}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <input type="text" className="form-control" value={newPerson.capacity} onChange={(e) => setNewPerson({ ...newPerson, capacity: e.target.value })} placeholder="Capaciteit" />
                                        </div>
                                        <div className="col-1">
                                            <button className="btn form-control btn-outline-success" onClick={() => {
                                                setIncident({ ...incident, deployedPersonel: [...incident.deployedPersonel, newPerson] })
                                                setNewPerson({ person: '', capacity: '' })
                                            }}>+</button>
                                        </div>
                                    </div>
                                ) : null
                            }
                            <br />
                            <label>Ingezette middelen</label>
                            {
                                incident.deployedResources && incident.deployedResources.map((deployedResource, index) => {
                                    return (
                                        <div key={index} className="row mb-4">
                                            <div className={`col-${readOnly ? '12' : '11'}`}>
                                                <select className="form-control" value={deployedResource._id} readOnly={true} disabled={true} onChange={(e) => setIncident({ ...incident, deployedResources: incident.deployedResources.map((r, i) => i === index ? e.target.value : r) })}>
                                                    <option value=''>Selecteer een middel</option>
                                                    {
                                                        resourcesState.resources.map((resource, resourceIndex) => {
                                                            return <option key={resourceIndex} value={resource._id}>{resource.discipline} - {resource.name} - {resource.description}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            {
                                                !readOnly ? (
                                                    <div className="col-1">
                                                        <button className="btn form-control btn-outline-danger" onClick={() => {
                                                            setIncident({ ...incident, deployedResources: incident.deployedResources.filter((r, i) => r !== deployedResource) })
                                                        }}>-</button>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    )
                                })
                            }
                            {/* Add resource to incident */}
                            {
                                !readOnly ? (
                                    <div className="row">
                                        <div className="col-11">
                                            <select className="form-select" value={newResource} onChange={(e) => setNewResource(e.target.value)}>
                                                <option value=''>Selecteer een middel</option>
                                                {
                                                    resourcesState.resources.map((resource, resourceIndex) => {
                                                        return <option key={resourceIndex} value={resource._id}>{resource.discipline} - {resource.name} - {resource.description}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="col-1">
                                            <button className="btn form-control btn-outline-success" onClick={() => {
                                                setIncident({ ...incident, deployedResources: [...incident.deployedResources, newResource] })
                                                setNewResource('')
                                            }}>+</button>
                                        </div>
                                    </div>
                                ) : null
                            }
                            <br />
                            <label>Resultaat:</label>
                            <textarea className="form-control" value={incident.result.description} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, result: { ...result, description: e.target.value } })} />
                            <br />
                            <div className="row">
                                <div className="col-6">
                                    <label>Gewonden:</label>
                                    <input type="number" className="form-control" value={incident.result.wounded} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, result: { ...result, wounded: e.target.value } })} />
                                </div>
                                <div className="col-6">
                                    <label>Doden:</label>
                                    <input type="number" className="form-control" value={incident.result.deceased} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, result: { ...result, deceased: e.target.value } })} />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-6">
                                    <label>Vermisten:</label>
                                    <input type="number" className="form-control" value={incident.result.missing} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, result: { ...result, missing: e.target.value } })} />
                                </div>
                                <div className="col-6">
                                    <label>Geëvacueerd:</label>
                                    <input type="number" className="form-control" value={incident.result.evacuated} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, result: { ...result, evacuated: e.target.value } })} />
                                </div>
                            </div>
                            <br />
                            <label>Ongedeerd:</label>
                            <input type="number" className="form-control" value={incident.result.unharmed} readOnly={readOnly} onChange={(e) => setIncident({ ...incident, result: { ...result, unharmed: e.target.value } })} />
                            <br />
                            <label>Lessons learned:</label>
                            {
                                incident.lessonsLearned && incident.lessonsLearned.map((lesson, index) => {
                                    return (
                                        <div key={index} className="row mb-4">
                                            <div className={`col-${readOnly ? '12' : '11'}`}>
                                                <input type="text" className="form-control" value={lesson} readOnly={true} onChange={(e) => setIncident({ ...incident, lessonsLearned: incident.lessonsLearned.map((l, i) => i === index ? e.target.value : l) })} />
                                            </div>
                                            {
                                                !readOnly ? (
                                                    <div className="col-1">
                                                        <button className="btn form-control btn-outline-danger" onClick={() => {
                                                            setIncident({ ...incident, lessonsLearned: incident.lessonsLearned.filter((l, i) => l !== lesson) })
                                                        }}>-</button>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    )
                                })
                            }
                            {/* Add lesson learned */}
                            {
                                !readOnly ? (
                                    <div className="row">
                                        <div className="col-11">
                                            <input type="text" className="form-control" value={newLesson} onChange={(e) => setNewLesson(e.target.value)} placeholder="Lessons learned" />
                                        </div>
                                        <div className="col-1">
                                            <button className="btn form-control btn-outline-success" onClick={() => {
                                                setIncident({ ...incident, lessonsLearned: [...incident.lessonsLearned, newLesson] })
                                                setNewLesson('')
                                            }}>+</button>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                        {
                            incidentsState.errorMessage ? (
                                <div className='row m-2'>
                                    <div className='col-12'>
                                        <div className='alert alert-danger' role='alert'>
                                            {incidentsState.errorMessage}
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                ) : null
            }
        </div>
    )
}

export default Detail;