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
    Button,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    Delete,
    AddCircle,
    Edit
} from '@mui/icons-material';
import {NumericFormat} from 'react-number-format';

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
    const [openDialogCreateEmployee, setOpenDialogCreateEmployee] = useState(false);
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
    const [jobTitles, setJobTitles] = useState([]);
    const [editDialog, setEditDialog] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [nameEmployee, setNameEmployee] = useState('');
    const [idJobTitleEmployee, setIdJobTitleEmployee] = useState('');
    const [salaryEmployee, setSalaryEmployee] = useState('');
    const [idEmployee, setIdEmployee] = useState('');
    const [jobTitleEmployee, setJobTitleEmployee] = useState({});
    const [editEmployee, setEditEmployee] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState(false);

    useEffect(() => {
        async function getCompanies() {
            const response = await api.get('/Companies');

            if (response.data) {
                setListCompanies(response.data.data);
            }
        }
        getCompanies();

        async function getJobTitles() {
            const response = await api.get('/JobTitles');

            if (response.data.success) {
                let list = [];

                await response.data.data.map(job => {
                    list.push({
                        label: job.name,
                        id: job.id
                    });
                });

                setJobTitles(list);
            }
        }
        getJobTitles();
    }, []);

    useEffect(() => {
        if (zipcode.length === 8) {
            getAddressCep();
        }
    }, [zipcode])

    function onCloseDialog() {
        setOpenDialog(false);
    }
    function onCloseDialogExclude() {
        setOpenDialogExclude(false);
        setDeleteEmployee(false);
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

    function clearEmployee() {
        setIdEmployee('');
        setNameEmployee('');
        setIdJobTitleEmployee('');
        setSalaryEmployee('');
        setJobTitleEmployee({});
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

        if (!telephone) {
            alert('Favor preencher o telefone da empresa');
            return;
        }

        Object.assign(obj, {
            name: name ? name : '',
            zipcode: zipcode ? zipcode : '',
            street: street ? street : '',
            number: number ? number : '',
            complement: complement ? complement : '',
            neighborhood: neighborhood ? neighborhood : '',
            city: city ? city : '',
            state: state ? state : '',
            telephone: telephone ? telephone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '') : '',

        });

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

    async function updateCompany() {
        const obj = {};
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

        if (!telephone) {
            alert('Favor preencher o telefone da empresa');
            return;
        }

        Object.assign(obj, {
            name: name ? name : '',
            zipcode: zipcode ? zipcode : '',
            street: street ? street : '',
            number: number ? number : '',
            complement: complement ? complement : '',
            neighborhood: neighborhood ? neighborhood : '',
            city: city ? city : '',
            state: state ? state : '',
            telephone: telephone ? telephone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '') : '',
        });

        const response = await api.put(`/Companies/${id}`, obj);

        if (response.data.success) {
            alert('Empresa atualizada com sucesso!');
            clearDialog();
            setDisableEdit(true);

            const responseCompanies = await api.get('/Companies');

            if (responseCompanies.data.success) {
                setListCompanies(responseCompanies.data.data);
                setOpenDialog(false);
            }
        }
    }

    async function createEmployee() {
        const obj = {};

        if (!nameEmployee) {
            alert('Favor preencher o nome do funcionário');
            return;
        }

        if (!idJobTitleEmployee) {
            alert('Favor selecionar o cargo do funcionário');
            return;
        }

        if (!salaryEmployee) {
            alert('Favor preencher o salário do funcionário');
            return;
        }

        Object.assign(obj, {
            name: nameEmployee,
            JobTitlesId: idJobTitleEmployee,
            CompanyId: id,
            salary: Number(salaryEmployee.replace('R$', '').replace('.', '').replace(',', '.')).toFixed(2)
        });

        console.log('obj', obj);

        const response = await api.post('/Employees', obj);

        if (response.data.success) {
            alert('Funcionário cadastrado com sucesso');

            const responseCompanies = await api.get(`/Companies/${id}`);

            if (responseCompanies.data.success) {
                console.log('vai preencher')
                const {data: obj} = responseCompanies.data;
                setName(obj.name);
                setStreet(obj.street);
                setNumber(obj.number);
                setNeighborhood(obj.neighborhood);
                setZipcode(obj.zipcode);
                setState(obj.state);
                setCity(obj.city);
                setTelephone(obj.telephone);
                setComplement(obj.complement);
                setEmployees(obj.employees);
                console.log('preencheu')
            }

            clearEmployee();
            setOpenDialogCreateEmployee(false);
        }
    }

    async function updateEmployee() {
        const obj = {};

        if (!nameEmployee) {
            alert('Favor preencher o nome do funcionário');
            return;
        }

        if (!idJobTitleEmployee) {
            alert('Favor selecionar o cargo do funcionário');
            return;
        }

        if (!salaryEmployee) {
            alert('Favor preencher o salário do funcionário');
            return;
        }

        Object.assign(obj, {
            name: nameEmployee,
            JobTitlesId: idJobTitleEmployee,
            salary: Number(salaryEmployee.replace('R$', '').replace('.', '').replace(',', '.')).toFixed(2)
        });

        console.log('obj', obj);

        const response = await api.put(`/Employees/${idEmployee}`, obj);

        if (response.data.success) {
            alert('Funcionário Atualizado com sucesso');

            const responseCompanies = await api.get(`/Companies/${id}`);

            if (responseCompanies.data.success) {
                console.log('vai preencher')
                const {data: obj} = responseCompanies.data;
                setName(obj.name);
                setStreet(obj.street);
                setNumber(obj.number);
                setNeighborhood(obj.neighborhood);
                setZipcode(obj.zipcode);
                setState(obj.state);
                setCity(obj.city);
                setTelephone(obj.telephone);
                setComplement(obj.complement);
                setEmployees(obj.employees);
                console.log('preencheu')
            }

            clearEmployee();
            setEditEmployee(false);
            setOpenDialogCreateEmployee(false);
        }
    }

    async function excludeEmployee() {
        const response = await api.delete(`/Employees/${idEmployee}`);

        if (response.data.success) {
            if (response.data.success) {
                alert('Funcionário excluído com sucesso');

                const responseCompanies = await api.get(`/Companies/${id}`);

                if (responseCompanies.data.success) {
                    console.log('vai preencher')
                    const {data: obj} = responseCompanies.data;
                    setName(obj.name);
                    setStreet(obj.street);
                    setNumber(obj.number);
                    setNeighborhood(obj.neighborhood);
                    setZipcode(obj.zipcode);
                    setState(obj.state);
                    setCity(obj.city);
                    setTelephone(obj.telephone);
                    setComplement(obj.complement);
                    setEmployees(obj.employees);
                    console.log('preencheu')
                }

                clearEmployee();
                setDeleteEmployee(false);
                setOpenDialogExclude(false);
            }
        }
    }

    async function getAddressCep() {
        const response = await api.get(`/Zipcode/${zipcode}`);
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
                {
                    listCompanies.length ? (
                        <div>
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
                                                        setTelephone(company.telephone);
                                                        setOpenDialog(true);
                                                        setEmployees(company.employees);
                                                        setEditDialog(false);
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
                    ) : (
                        <div>
                            <h2>Não foi encontrado empresas cadastradas</h2>
                        </div>
                    )
                }
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

                                <div style={{
                                    display: 'flex',
                                }}>
                                    <h2>Funcionários</h2>

                                    <IconButton
                                        onClick={() => {
                                            clearEmployee();
                                            setOpenDialogCreateEmployee(true)
                                        }}
                                    >
                                        <AddCircle
                                            color="success"
                                        />
                                    </IconButton>
                                </div>

                                {employees.length ? (
                                    <div>


                                        <Table>
                                            <TableHead>
                                                <TableCell style={styles.tableHead}>Identificador</TableCell>
                                                <TableCell style={styles.tableHead}>Nome</TableCell>
                                                <TableCell style={styles.tableHead}>Cargo</TableCell>
                                                <TableCell style={styles.tableHead}>Salário</TableCell>
                                                <Table style={styles.tableHead}>Detalhes</Table>
                                            </TableHead>
                                            <TableBody>
                                                {employees.map(emp => (
                                                    <TableRow>
                                                        <TableCell>{emp.id}</TableCell>
                                                        <TableCell>{emp.name}</TableCell>
                                                        <TableCell>{emp.jobTitles.name}</TableCell>
                                                        <TableCell>{`R$ ${Number(emp.salary).toFixed(2).toString().replace('.', ',')}`}</TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setIdEmployee(emp.id);
                                                                    setNameEmployee(emp.name);
                                                                    setJobTitleEmployee({
                                                                        label: emp.jobTitles.name,
                                                                        id: emp.jobTitles.id,
                                                                    });
                                                                    setIdJobTitleEmployee(emp.jobTitles.id);
                                                                    setSalaryEmployee(Number(emp.salary).toFixed(2).toString().replace('.', ','));
                                                                    setOpenDialogCreateEmployee(true);
                                                                    setEditEmployee(true);
                                                                }}>
                                                                <Visibility />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setIdEmployee(emp.id);
                                                                    setNameEmployee(emp.name);
                                                                    setOpenDialogExclude(true);
                                                                    setDeleteEmployee(true);
                                                                }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : <h4>Empresa não possui funcionários cadastrados</h4>}
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
                                    onClick={() => updateCompany()}
                                >Atualizar</Button>

                            </div>
                        )
                    }

                </DialogContent>
            </Dialog>

            <Dialog open={openDialogExclude} onClose={onCloseDialogExclude}>
                <h2>{deleteEmployee ? `Deseja excluir o funcionário ${nameEmployee}?` : `Deseja excluir a empresa ${companyDialog.name}?`}</h2>

                <Button
                    onClick={() => deleteEmployee ? excludeEmployee() : excludeCompany()}
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

            <Dialog open={openDialogCreateEmployee} onClose={() => {
                setOpenDialogCreateEmployee(false);
                setEditEmployee(false);

            }}>
                <div style={{
                    margin: 10
                }}>
                    <h1>{editEmployee ? 'Editar Funcionário' : 'Criar Funcionário'}</h1>

                    <h2>Empresa: {name}</h2>

                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Nome"
                            value={nameEmployee ? nameEmployee : ''}
                            style={styles.textFieldCompany}
                            onChange={e => setNameEmployee(e.target.value)}
                        />

                        <NumericFormat
                            required
                            prefix={'R$'}
                            customInput={TextField}
                            style={styles.textFieldCompany}
                            label="Salário"
                            value={salaryEmployee ? salaryEmployee : ''}
                            decimalSeparator=","
                            decimalScale={2}
                            allowedDecimalSeparators={','}
                            thousandSeparator='.'
                            thousandsGroupStyle="thousand"
                            //onValueChange={v => setSalaryEmployee(v.value)}
                            onChange={e => setSalaryEmployee(e.target.value)}
                        />

                        <Autocomplete
                            options={jobTitles}
                            value={jobTitleEmployee ? jobTitleEmployee : {}}
                            style={styles.textFieldCompany}
                            onChange={(e, newValue) => {
                                setIdJobTitleEmployee(newValue.id)
                                setJobTitleEmployee(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Cargo" />}
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
                        onClick={() => editEmployee ? updateEmployee() : createEmployee()}
                    >{editEmployee ? 'Atualizar' : 'Criar'}</Button>
                </div>
            </Dialog>

        </Container >
    )
}

export default Company;