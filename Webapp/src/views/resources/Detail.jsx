import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { Context as ResourcesContext } from "../../context/resourcesContext";
import Swal from 'sweetalert2'

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { state, getResource, updateResource, addResource } = useContext(ResourcesContext);

    const [readOnly, setReadOnly] = useState(true);
    const [resource, setResource] = useState({});

    useEffect(() => {
        if (id != 'aanmaken') {
            getResource(id);
        } else {
            setResource({ active: true });
        }
    }, []);

    useEffect(() => {
        if (state.resource && id != 'aanmaken') {
            setResource(state.resource);
        } else {
            setReadOnly(false);
        }
    }, [state.resource]);

    const onSave = async () => {
        Swal.fire({
            title: 'Weet je het zeker?',
            text: 'Weet je zeker dat je dit middel wilt opslaan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ja, opslaan'
        }).then((result) => {
            if (result.isConfirmed) {
                if (!resource.name || !resource.discipline || !resource.type || !resource.description) {
                    Swal.fire({
                        title: 'Vul alle velden in',
                        text: 'Vul alle velden in om dit middel te kunnen opslaan',
                        icon: 'warning',
                        showConfirmButton: true,
                        confirmButtonColor: '#007bff'
                    }).then(() => {
                        return;
                    })
                } else {
                    if (resource._id) {
                        updateResource(id, resource, () => {
                            Swal.fire({
                                title: 'Middel opgeslagen',
                                text: 'Dit middel is succesvol opgeslagen',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true
                            }).then(() => {
                                setReadOnly(true)
                            })
                        });
                    } else {
                        addResource(resource, () => {
                            Swal.fire({
                                title: 'Middel opgeslagen',
                                text: 'Dit middel is succesvol opgeslagen',
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
                resource ? (
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3>{resource.name}</h3>
                            <div className="card-tools ml-auto">
                                <button className={`btn btn-outline-${readOnly ? 'warning' : 'success'} mr-2`} onClick={() => {
                                    if (readOnly) {
                                        setReadOnly(false);
                                    } else {
                                        onSave();
                                    }
                                }}>{readOnly ? 'Wijzigen' : 'Opslaan'}</button>
                                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Terug</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="col">
                                    <label>Naam:</label>
                                    <input type="text" className="form-control" value={resource.name} readOnly={readOnly} onChange={(e) => setResource({ ...resource, name: e.target.value })} />
                                </div>
                                <div className="col">
                                    <label>Discipline:</label>
                                    <input type="text" className="form-control" value={resource.discipline} readOnly={readOnly} onChange={(e) => setResource({ ...resource, discipline: e.target.value })} />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <label>Type:</label>
                                    <input type="text" className="form-control" value={resource.type} readOnly={readOnly} onChange={(e) => setResource({ ...resource, type: e.target.value })} />
                                </div>
                                <div className="col">
                                    <label>Omschrijving:</label>
                                    <input type="text" className="form-control" value={resource.description} readOnly={readOnly} onChange={(e) => setResource({ ...resource, description: e.target.value })} />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <label>Actief:</label>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDisabled" id="flexRadioDisabled" disabled={readOnly} checked={resource.active} onChange={(e) => setResource({ ...resource, active: true })} />
                                        <label className="form-check-label">
                                            Ja
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDisabled" id="flexRadioCheckedDisabled" disabled={readOnly} checked={!resource.active} onChange={(e) => setResource({ ...resource, active: false })} />
                                        <label className="form-check-label">
                                            Nee
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            state.errorMessage ? (
                                <div className='row m-2'>
                                    <div className='col-12'>
                                        <div className='alert alert-danger' role='alert'>
                                            {state.errorMessage}
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