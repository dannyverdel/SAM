import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { Context as PersonsContext } from "../../context/personsContext";
import Swal from 'sweetalert2'

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { state, getPerson, updatePerson, addPerson } = useContext(PersonsContext);

    const [readOnly, setReadOnly] = useState(true);
    const [person, setPerson] = useState({});

    useEffect(() => {
        if (id != 'aanmaken') {
            getPerson(id);
        } else {
            setPerson({ active: true });
        }
    }, []);

    useEffect(() => {
        if (state.person && id != 'aanmaken') {
            setPerson(state.person);
        } else {
            setReadOnly(false);
        }
    }, [state.person]);

    console.log(state)
    console.log(person)

    const onSave = async () => {
        Swal.fire({
            title: 'Weet je het zeker?',
            text: 'Weet je zeker dat je de persoon wilt opslaan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ja, opslaan'
        }).then((result) => {
            if (result.isConfirmed) {
                if (!person.name || !person.position) {
                    Swal.fire({
                        title: 'Vul alle velden in',
                        text: 'Vul alle velden in om de persoon te kunnen opslaan',
                        icon: 'warning',
                        showConfirmButton: true,
                        confirmButtonColor: '#007bff'
                    }).then(() => {
                        return;
                    })
                } else {
                    if (person._id) {
                        updatePerson(id, person, () => {
                            Swal.fire({
                                title: 'Persoon opgeslagen',
                                text: 'De persoon is succesvol opgeslagen',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true
                            }).then(() => {
                                setReadOnly(true)
                            })
                        });
                    } else {
                        addPerson(person, () => {
                            Swal.fire({
                                title: 'Persoon opgeslagen',
                                text: 'De persoon is succesvol opgeslagen',
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
                person ? (
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3>{person.name}</h3>
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
                                    <input type="text" className="form-control" value={person.name} readOnly={readOnly} onChange={(e) => setPerson({ ...person, name: e.target.value })} />
                                </div>
                                <div className="col">
                                    <label>Functie:</label>
                                    <input type="text" className="form-control" value={person.position} readOnly={readOnly} onChange={(e) => setPerson({ ...person, position: e.target.value })} />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <label>Actief:</label>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDisabled" id="flexRadioDisabled" disabled={readOnly} checked={person.active} onChange={(e) => setPerson({ ...person, active: true })} />
                                        <label className="form-check-label">
                                            Ja
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDisabled" id="flexRadioCheckedDisabled" disabled={readOnly} checked={!person.active} onChange={(e) => setPerson({ ...person, active: false })} />
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