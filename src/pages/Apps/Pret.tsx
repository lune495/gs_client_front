import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setDisconnect, setPageTitle } from '../../store/themeConfigSlice';
import Btn from '../Components/Buttons/Btn';
import { getApiUrl, getData, sendData } from '../../Methodes';
import IconBtn from '../Components/Buttons/IconBtn';
import Loader from '../Components/Utils/Loader';
import Select from 'react-select';
import {  TRANSACTION_URL } from '../../store/constants';
// import ServiceList from '../Components/Details/ServiceList';
// import DetailFacture from '../Components/Details/DetailFacture';
import { LockClosedIcon, PowerIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../Components/Forms/TransactionForm';


const Pret = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [detailModal, setDetailModal] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [venteId, setVenteId] = useState<any>();
    const [loading, setLoading] = useState<any>(false);

    const [defaultParams] = useState({
        id: null,
        libelle: '',
        color: '',
        
    });

    const [form, setForm] = useState<any>({});
    const [params, setParams] = useState<any>({});
    const [filteredItemsInit, setFilteredItemsInit] = useState<any>([]);
    const [filterDate, setFilterDate] = useState<any>([]);

    const [search, setSearch] = useState<any>('');
    const [moduleSelected, setModuleSelected] = useState<number>(-1);
    const [modules, setModules] = useState<any>([]);
    const [response, setResponse] = useState<any>({});
    const [contactList] = useState<any>([]);

    const navigate = useNavigate();

    const [filteredItems, setFilteredItems] = useState<any>([]);

    useEffect(() => {
        setFilteredItems(() => {
            return contactList.filter((item: any) => {
                return item.typePaiement.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList]);

  
    useEffect(() => {
        getStatus()
    }, []);


    const clotureCaisse=async()=>{
        setShowLoader(true)
        await sendData(
            "api/cloture_caisse",
            {},
           )
            .then(async (resp:any)=> {
               console.log("resp",resp?.data)

               handlePrintSituation()
               
            })
            .catch((resp:any) => {
             
                let violations = resp?.response?.data?.message ;
                console.log("errros",resp)
 
            });
            setShowLoader(false)
    }

    const saveUser = async(e:any) => {
        let msg=e?.id?"modifié":"ajouté"

        if(!e.client_id || e.debit==0){
              showMessage(`Veuillez renseigner le montant et le client`,"error");
            return
        }
        setLoading(true)
        console.log("req",e)
            await sendData(
                "api/transactions",
                e,
               )
                .then(async (resp:any)=> {
                   console.log("resp",resp?.data)
                   if(resp?.data?.data){
                        refreshData(resp?.data?.data?.transactions[0])
                        setResponse(resp?.data?.data?.transactions[0])
                        setParams({})
                        setLoading(false)
                        setAddContactModal(false)
                        showMessage(`Prêt ${msg} avec succès.`);
                        
                   }else{
                    setLoading(false)
                    showMessage(`${resp?.data?.errors}`,'error');
                   }
                   
                })
                .catch((resp:any) => {
                    setLoading(false)
                    let violations = resp?.response?.data?.message ;
                    console.log("errros",resp)
     
                });
                
                // setAddContactModal(false);
            
       

        
    };

    const refreshData=(data:any)=>{

        if(params?.id){
            const id: any = filteredItems.findIndex((d: any) => d.id === params.id);
            let old=filteredItems
            old[id]=data
            setFilteredItems(old)
            setFilteredItemsInit(old)
        }else{
            setFilteredItems([data,...filteredItems])
            setFilteredItemsInit([data,...filteredItems])
        }
    }

  

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const handleInfos = (user: any ) => {
        setParams(user);
        
        setDetailModal(true);
    };

    const handlePrint=(el:any)=>{
        setVenteId(el?.id)
        setTimeout(()=>document?.getElementById("pdf")?.click())
    }

    const handlePrintSituation=()=>{
        // document?.getElementById("pdf-cloture")?.click()
        dispatch(setDisconnect("deconnexion"))
        navigate("/auth/boxed-signin")
    }

   const handleFilter=(e:any)=>{
    setModuleSelected(parseInt(e))
    setFilteredItems(filteredItemsInit?.filter((el:any)=>el?.module.id==e))
   }

    const getStatus=async()=>{
        const { data } = await getData(TRANSACTION_URL);
        setFilteredItems(data?.data?.transactions?.filter((e:any)=>e.debit>0));
    }

     const getSearch=async(el:any)=>{
        if(el.length>2){
                 const { data } = await getData(`graphql?query={services(nom_complet:"${el}"){id,created_at,nom_complet,montant_total,nature,montant,adresse,remise,
        medecin{id,nom,prenom},module{id,nom},element_services{id,type_service{nom,prix}},module{nom},user{id,name}}}`);
        setFilteredItems(data?.data?.services);
        setFilteredItemsInit(data?.data?.services)
        }else if(!el.length){
            getStatus()
        }
    }

    const CloseCaisse=()=>{
        Swal.fire({
            icon: 'warning',
            title: 'Etes vous sur d\'éffectuer cette tache?',
            text: "Cette action est irreversible\n et vous serai déconnecté après cette action; rassurez-vous d'avoir imprimer votre situation générale.",
            showCancelButton: true,
            confirmButtonText: 'Cloturer ma caisse',
			cancelButtonText: "Annuler",
            showLoaderOnConfirm: true,
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result) => {
            if (result.value) {
                clotureCaisse()
            }
        });
    }


    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };


    return (
        <div>
             {showLoader && (
                    <Loader/>
                )}
                <div
                            className="m-5 bg-white rounded-b-lg border-t-8 border-green-400 px-4 py-5 flex flex-col justify-around shadow-md"
                            >
            <div className="flex items-center justify-end flex-wrap gap-4">
                {/* <div className="flex md:flex-row gap-2 flex-col">
                    <div style={{minWidth:250}} className="mb-0 w-full">
                     <label htmlFor="name">Service</label> 
                        <Select  placeholder="Filter par service" onChange={(e:any)=>{handleFilter(e?.value)}} options={modules}  isSearchable={true}/>
                    </div>
                    {moduleSelected>=0 && <div style={{minWidth:200}} className="mb-0 mr-2 w-full">
                        <label htmlFor="name">Date 1</label>
                        <Select  placeholder="Date 1" onChange={(e:any)=>{setForm({...form,date1:e?.value})}} options={filterDate}  isSearchable={true}/>
                    </div>}
                    {moduleSelected>=0 && <div style={{minWidth:200}} className="mb-0 mr-5 w-full">
                        <label htmlFor="name">Date 2</label>
                        <Select  placeholder="Date 2" onChange={(e:any)=>{setForm({...form,date2:e?.value})}} options={filterDate}  isSearchable={true}/>
                    </div>}
                      <div style={{minWidth:400}} className="mb-5 lg:ml-9">
                            <label htmlFor="name">Recherche</label>
                            <input id="montant" type="text" placeholder="Entrer le nom du patient" className="form-input" value={form.target} onChange={(e) => {setForm({...form,target:e.target.value});getSearch(e.target.value)}} />
                    </div>
                </div>
                 */}
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    
                    <div className="flex gap-3">
                      
                        <div>
                            <button type="button" className="btn btn-success" onClick={() => editUser()}>
                            <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                                Nouveau prèt
                            </button>
                        </div>
                       
                       
                    </div>
                    {/* <div className="relative">
                        <input type="text" placeholder="Recherche" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                            </svg>
                        </button>
                    </div> */}
                </div>
            </div>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Libellé</th>
                                    <th>Nom du client</th>
                                    <th>Téléphone du cient</th>
                                    <th>Adresse du client</th>
                                    <th>Montant du prêt (Fcfa)</th>
                                    {/* <th>Solde (Fcfa)</th> */}
                                    {/* <th className="!text-center">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems ? filteredItems.map((contact: any) => {
                                    return (
                                        <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                           
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{"Facture N° "+ contact?.id}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.client?.nom_complet}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.client?.telephone}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.client?.adresse}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.debit?.toLocaleString()}</div>
                                                </div>
                                            </td>
                                              {/* <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.solde?.toLocaleString()}</div>
                                                </div>
                                            </td> */}
                                            {/* <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                   <IconBtn
                                                        isPrint={false}
                                                        isInfos={true}
                                                        handleInfos={()=>handleInfos(contact)}
                                                        handlePrint={()=>handlePrint(contact)}
                                                   />
                                                 
                                                </div>
                                            </td> */}
                                        </tr>
                                    );
                               } ): null}
                            </tbody>
                        </table>
                    </div>
                </div>

            {addContactModal && <TransactionForm isPret loading={loading}  data={{}} open={addContactModal} setOpen={()=>{setResponse({});setAddContactModal(false)}} handleValidate={(e:any)=>saveUser(e)}/>}
          </div>
        </div>
    );
};

export default Pret;
