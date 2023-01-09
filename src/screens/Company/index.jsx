import Header from "../../components/Header";
import {Container} from "./styles";
import {api} from '../../utils/api'
import {useEffect, useState} from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Dialog,
    DialogContent,
    TextField,
    Button
} from '@mui/material';
import {
    Visibility,
    Delete,
    AddCircle,
    Edit
} from '@mui/icons-material';

const styles = {
    tableHead: {
        fontWeight: 'bold'
    },
    divCompany: {
        display: 'flex'
    },
    divCreateCompany: {
        display: 'flex',
        flexDirection: 'column'
    },
    textFieldCompany: {
        margin: 10,
        width: 300
    }
};

function Company() {
    const [listCompanies, setListCompanies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogExclude, setOpenDialogExclude] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [companyDialog, setCompanyDialog] = useState({});
    const [disableEdit, setDisableEdit] = useState(true);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [telephone, setTelephone] = useState('');
    const [complement, setComplement] = useState('');
    const [employees, setEmployees] = useState([]);
    const [editDialog, setEditDialog] = useState(false);

    useEffect(() => {
        async function getCompanies() {
            const response = await api.get('/Companies');

            if (response.data) {
                setListCompanies(response.data.data);
            }
        }
        getCompanies();
    }, []);

    useEffect(() => {
        console.log('zipcode', zipcode.length)
        if (zipcode.length === 8) {
            getAddressCep();
        }
    }, [zipcode])

    function onCloseDialog() {
        setOpenDialog(false);
    }
    function onCloseDialogExclude() {
        setOpenDialogExclude(false);
    }
    function onCloseDialogCreate() {
        setOpenDialogCreate(false);
    }

    function clearDialog() {
        setName('');
        setStreet('');
        setNumber('');
        setNeighborhood('');
        setZipcode('');
        setState('');
        setCity('');
        setTelephone('');
        setComplement('');
        setId('');
    }

    const formatTelephone = (v) => {
        v = v.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        return v;
    }

    async function excludeCompany() {
        const response = await api.delete(`/Companies/${companyDialog.id}`);

        if (response.data.success) {
            const responseNewList = await api.get('/Companies');

            if (responseNewList.data.success) {
                setListCompanies(responseNewList.data.data);
                setOpenDialogExclude(false);
            }
        }
    }

    async function createCompany() {
        const obj = {};
        Object.assign(obj, {
            name: name ? name : '',
            address: street && number && neighborhood && city && state && zipcode
                ? `${street} , ${number} ${complement && complement} ${neighborhood} , ${city}-${state} ${zipcode}` : '',
            telephone: telephone ? telephone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '') : ''
        });

        if (!name) {
            alert('Favor preencher o nome da empresa');
            return;
        }

        if (!street) {
            alert('Favor preencher todos os campo rua da empresa');
            return;
        }
        if (!zipcode) {
            alert('Favor preencher todos os campo cep da empresa');
            return;
        }
        if (!number) {
            alert('Favor preencher todos os campo rua da empresa');
            return;
        }
        if (!neighborhood) {
            alert('Favor preencher todos os campo bairro da empresa');
            return;
        }

        if (!city) {
            alert('Favor preencher todos os campo cidade da empresa');
            return;
        }

        if (!state) {
            alert('Favor preencher todos os campo estado da empresa');
            return;
        }

        if (!obj.telephone) {
            alert('Favor preencher o telefone da empresa');
            return;
        }

        const response = await api.post('/Companies', obj);

        if (response.data.success) {
            alert('Empresa criada com sucesso!');
            clearDialog();
            setDisableEdit(true);

            const responseCompanies = await api.get('/Companies');

            if (responseCompanies.data.success) {
                setListCompanies(responseCompanies.data.data);
                setOpenDialogCreate(false);
            }
        }
    }

    async function getAddressCep() {
        console.log('buscando endereço')
        const response = await api.get(`/Zipcode/${zipcode}`);
        console.log(response)
        if (response.data) {
            setStreet(response.data.logradouro);
            setNeighborhood(response.data.bairro);
            setCity(response.data.localidade);
            setState(response.data.uf);

            if (response.data.complemento)
                setComplement(response.data.complemento);

            setDisableEdit(false);
        }
    }

    return (
        <Container>
            <Header />
            <div>
                <div style={styles.divCompany}>
                    <h1>Empresas</h1>
                    <IconButton
                        onClick={() => {
                            clearDialog();
                            setOpenDialogCreate(true)
                        }}>
                        <AddCircle color="success" />
                    </IconButton>
                </div>
                <Table>
                    <TableHead>
                        <TableCell style={styles.tableHead}>Identificador</TableCell>
                        <TableCell style={styles.tableHead}>Nome</TableCell>
                        <TableCell style={styles.tableHead}>Endereço</TableCell>
                        <TableCell style={styles.tableHead}>Telefone</TableCell>
                        <TableCell style={styles.tableHead}>Detalhes</TableCell>
                    </TableHead>
                    <TableBody>
                        {
                            listCompanies.length && listCompanies.map(company => (
                                <TableRow key={company.id}>
                                    <TableCell>{company.id}</TableCell>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell>{`${company.street},${company.number} ${company.complement && company.complement} ${company.neighborhood} , ${company.city}-${company.state} ${company.zipcode}`}</TableCell>
                                    <TableCell>{company.telephone && formatTelephone(company.telephone)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            setId(company.id);
                                            setName(company.name);
                                            setStreet(company.street);
                                            setNumber(company.number);
                                            setComplement(company.complement);
                                            setNeighborhood(company.neighborhood);
                                            setCity(company.city);
                                            setState(company.state);
                                            setZipcode(company.zipcode);
                                            setTelephone(company.telephone)
                                            setOpenDialog(true)
                                            setEmployees(company.employees)
                                        }}>
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setCompanyDialog(company);
                                                setOpenDialogExclude(true);
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>


            <Dialog
                open={openDialog}
                onClose={onCloseDialog}
                maxWidth="lg"
                fullWidth={true}>
                <DialogContent>

                    {
                        !editDialog ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{display: 'flex', flexDirection: 'row', margin: 10}}>
                                    <h1>{companyDialog ? `Empresa: ${name}` : ''}</h1>

                                    <IconButton
                                        style={{
                                            marginLeft: 20
                                        }}
                                        onClick={() => setEditDialog(!editDialog)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </div>

                                <span style={{fontSize: 25, margin: 5}}><strong>Cep:</strong>{zipcode}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Telefone:</strong>{formatTelephone(telephone)}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Rua:</strong>{street}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Número:</strong>{number}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Bairro:</strong>{neighborhood}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Complemento:</strong>{complement}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Cidade:</strong>{city}</span>
                                <span style={{fontSize: 25, margin: 5}}><strong>Estado:</strong>{state}</span>

                                {employees.length && (
                                    <div>
                                        <Table>
                                            <TableHead>
                                                <TableCell style={styles.tableHead}>Identificador</TableCell>
                                                <TableCell style={styles.tableHead}>Nome</TableCell>
                                                <TableCell style={styles.tableHead}>Salário</TableCell>
                                            </TableHead>
                                            <TableBody>
                                                {employees.map(emp => (
                                                    <TableRow>
                                                        <TableCell>{emp.id}</TableCell>
                                                        <TableCell>{emp.name}</TableCell>
                                                        <TableCell>{emp.salary}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div style={{
                                    display: 'flex'
                                }}>
                                    <h1>Editar Empresa</h1>
                                    <IconButton
                                        style={{
                                            marginLeft: 20
                                        }}
                                        onClick={() => setEditDialog(!editDialog)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </div>


                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Nome"
                                        value={name ? name : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setName(e.target.value)}
                                    />



                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Cep"
                                        value={zipcode ? zipcode : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => {
                                            setZipcode(e.target.value)
                                        }}
                                    />

                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Telefone"
                                        value={telephone ? formatTelephone(telephone) : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setTelephone(formatTelephone(e.target.value))}
                                    />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Rua"
                                        value={street ? street : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setStreet(e.target.value)}
                                    />

                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Número"
                                        value={number ? number : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setNumber(e.target.value)}
                                    />

                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Bairro"
                                        value={neighborhood ? neighborhood : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setNeighborhood(e.target.value)}
                                    />

                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Complemento"
                                        value={complement ? complement : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setComplement(e.target.value)}
                                    />

                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Cidade"
                                        value={city ? city : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setCity(e.target.value)}
                                    />

                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Estado"
                                        value={state ? state : ''}
                                        style={styles.textFieldCompany}
                                        onChange={e => setState(e.target.value)}
                                    />
                                </div>

                                <Button
                                    style={{
                                        background: '#06b2f7',
                                        height: 50,
                                        width: 200,
                                        color: '#fff',
                                        margin: 15,
                                        float: 'right',
                                        marginRight: 250
                                    }}
                                    onClick={() => createCompany()}
                                >Atualizar</Button>





                            </div>
                        )
                    }

                </DialogContent>
            </Dialog>

            <Dialog open={openDialogExclude} onClose={onCloseDialogExclude}>
                <h2>Deseja excluir a empresa {companyDialog.name}?</h2>

                <Button
                    onClick={() => excludeCompany()}
                    color="primary">Sim</Button>
                <Button
                    color="error"
                    onClick={() => onCloseDialogExclude()}
                >Não</Button>
            </Dialog>

            <Dialog
                open={openDialogCreate}
                onClose={onCloseDialogCreate}
                maxWidth="lg"
                fullWidth={true}
            >
                <div>
                    <h1 style={{margin: 10}}>Criar Empresa</h1>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Cep"
                            onChange={e => {
                                setZipcode(e.target.value)
                            }}
                            value={zipcode}
                        />

                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Telefone"
                            value={telephone}
                            onChange={e => setTelephone(formatTelephone(e.target.value))}
                        />

                    </div>

                    <div>



                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Rua"
                            disabled={disableEdit}
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                        />
                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Número"
                            onChange={e => setNumber(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Bairro"
                            disabled={disableEdit}
                            value={neighborhood}
                            onChange={e => setNeighborhood(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCompany}
                            id="outlined-required"
                            label="Complemento"
                            disabled={disableEdit}
                            value={complement}
                            onChange={e => setComplement(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Cidade"
                            disabled={disableEdit}
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />

                        <TextField
                            style={styles.textFieldCompany}
                            required
                            id="outlined-required"
                            label="Estado"
                            disabled={disableEdit}
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />

                    </div>
                    <Button
                        style={{
                            background: '#06b2f7',
                            height: 50,
                            width: 200,
                            color: '#fff',
                            margin: 15,
                            float: 'right',
                            marginRight: 250
                        }}
                        onClick={() => createCompany()}
                    >Criar</Button>

                </div>

            </Dialog>
        </Container >
    )
}

export default Company;