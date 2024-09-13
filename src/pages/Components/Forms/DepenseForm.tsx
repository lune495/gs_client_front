import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import Select from 'react-select';
import { Typography } from "@material-tailwind/react";
import { getData } from "../../../Methodes";

const DepenseForm:FunctionComponent<BtnProps> = ({open,data,loading,setOpen,handleValidate}) => {
    const [params, setParams] = useState<any>(data?.id?data:{});
    const [search, setSearch] = useState<any>('');
    const [current, setCurrent] = useState<any>(false);
    
 
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

   

  
    return (
        <Transition appear show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={() => setOpen()} className="relative z-50">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-[black]/60" />
            </Transition.Child>
            <div   className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center px-4 py-8">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel style={{borderWidth:2,borderColor:"#ff8041"}} className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button
                                type="button"
                                onClick={() => setOpen()}
                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                            <div style={{color:"#ff8041"}} className="uppercase underline">{params.id ? 'Editer depense' : 'Nouvel depense'}</div>
                            </div>
                            <div className="p-5">
                              <form>
                                
                              <div className="mb-5">
                                <label htmlFor="name">Nom</label>
                                <input id="nom" type="text" placeholder="Entrer le nom" className="form-input" value={params.nom} onChange={(e) => changeValue(e)} />
                              </div>

                              <div className="mb-5">
                                <label htmlFor="name">Prix</label>
                                <input id="montant" type="number" placeholder="Entrer le montant" className="form-input" value={params.montant} onChange={(e) => changeValue(e)} />
                              </div>
                           
                                <div className="flex justify-end items-center mt-8">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setOpen()}>
                                        Annuler
                                    </button>
                                    {loading?<button type="button" className="btn btn-primary btn-md ml-1">
                                            <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                            Enregitrement...
                                        </button>: 
                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={()=>handleValidate(params)}>
                                            {params.id ? 'Modifier' : 'Ajouter'}
                                    </button>}
                                </div>
                             </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
    )

}

export default DepenseForm;

interface BtnProps {
    open: boolean;
    loading: boolean;
    setOpen: any;
    data: any;
    handleValidate: any;
    
}