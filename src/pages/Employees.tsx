import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useGet from '../hooks/get';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import { FaEye, FaEyeSlash, FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import usePost from '../hooks/post';
import { toast } from 'sonner';
import DeleteModal from '../components/modal/deleteModal';
import useDelete from '../hooks/delete';
import usePut from '../hooks/put';
import axios from '../service/api';
import ReactPaginate from 'react-paginate';
import { Button } from '@material-tailwind/react';
import ImagePreview from '../components/imgView/Imgview';
import { attechment } from '../service/urls';
import { BsImage } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa6';

interface Type {
  fullName: string;
  phoneNumber: any;
  password: string;
}

const Employees = () => {
  const { post, isLoading: postIsloading } = usePost();
  const { data, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsLoading } = useDelete();
  const { put, isLoading: putIsLoading, error: putError } = usePut();

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [editModal, setEditModal] = useState(false);
  const [edit, setEdit] = useState<any>();
  const [file, setFile] = useState<any>();
  const [page, setPage] = useState<number>(0);
  const [imageUpdateLoading, setImageUpdateLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [all, setAll] = useState<Type>({
    fullName: '',
    phoneNumber: '+998',
    password: '',
  });
 //  console.clear();
  const toggleModal = () => {
    setToggle(!toggle);
    setAll({
      fullName: '',
      phoneNumber: '+998',
      password: '',
    });
  };
  const editToggleModal = () => setEditModal(!editModal);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  function formatPhoneNumber(phoneNumber: any) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return null;
  }

  const handleDelete = async () => {
   //  console.clear();
    try {
      await remove('/user?userId=', deleteId);
      deleteToggleModal();
      get('/user/employees', page);
      toast.success("Mufaqiyatli o'chirildi");
    } catch (error) {
      toast.error('Hatolik yuz berdi');
    }
  };

  const validate = () => {
    if (
      !all.fullName.trim().length ||
      !all.phoneNumber.length ||
      !all.password.trim().length
    )
      return true;
    return false;
  };

  const handleClick = async () => {
   //  console.clear();
    try {
      if (all.phoneNumber.length !== 13) {
        throw new Error('Raqam mos kelmadi');
      }

      let attachmentId = 0;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post(`/attachment/upload`, formData);
        attachmentId = data.data.body;
      }

      await post('/auth/register', {
        ...all,
        attachmentId,
      });

      toast.success("Mufaqiyatli qo'shildi");
      toggleModal();
      get('/user/employees', page);

      setAll({
        fullName: '',
        phoneNumber: null,
        password: '',
      });
      setFile(null);
    } catch (error: any) {
      toast.error('Hatolik yuz berdi');
    }
  };

  const handleEdit = async () => {
   //  console.clear();
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (!all.fullName.trim().length || !all.password.trim().length)
        throw new Error("Bo'sh maydoni to'ldiring");

      if (all.phoneNumber.toString().length !== 13) {
        throw new Error('Raqam mos kelmadi');
      }

      setImageUpdateLoading(true);
      const data = file && (await axios.post(`/attachment/upload`, formData));

      await put('/auth/edit/by/admin', edit.id, {
        ...all,
        phoneNumber: all.phoneNumber,
        attachmentId: data ? data.data.body : 0,
      });

      if (putError) throw new Error();
      else {
        toast.success('Mufaqiyatli tahrirlandi');

        get('/user/employees', page);
      }
      setAll({
        fullName: '',
        phoneNumber: null,
        password: '',
      });
      setFile(null);
      editToggleModal();
    } catch (error: any) {
      toast.error('Hatolik yuz berdi');
    } finally {
      setImageUpdateLoading(false);
    }
  };
  const handlePageClick = (page: any) => {
    setPage(page.selected);
  };

  useEffect(() => {
    get('/user/employees', page);
  }, [page]);

  useEffect(() => {
    if (edit) {
      setAll({
        fullName: edit.fullName,
        phoneNumber: edit.phoneNumber,
        password: '',
      });
    }
  }, [edit, editModal]);
 //  console.clear();
  return (
    <>
      <div className="mx-auto">
        <Breadcrumb pageName="Hodimlar" />

        <Button
          onClick={toggleModal}
          className="rounded-lg shadow bg-boxdark  my-5  px-6 py-3"
        >
          Qo'shish
        </Button>
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div
              className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default  ">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 min-w-[200px] py-3">
                      ISm
                    </th>
                    <th scope="col" className="px-6 min-w-[220px] py-3">
                      Telefon raqam
                    </th>
                    <th colSpan={2} scope="col" className="px-6 min-w-[220px] py-3">
                      Tahrirlash va uchirish
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.object.length
                    ? data.object.map((item: any, i: number) => (
                      <tr
                        key={item.id}
                        className="bg-gray-600 border-b hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {page * 10 + i + 1}
                        </th>
                        <td className='px-6 py-5'>
                          {
                            item.attachmentId ?
                              <ImagePreview
                                imageUrl={`${attechment}${item.attachmentId}`}
                                altText={item.name}
                              />
                              :
                              <FaUser size={50} />
                          }
                        </td>
                        <td className="px-6 py-5">{item.fullName}</td>
                        <td className="px-6 py-5">
                          {formatPhoneNumber(item.phoneNumber)}
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => {
                              editToggleModal();
                              setEdit(item);
                            }}
                          >
                            <FaRegEdit size={25} className="text-green-500" />
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => {
                              deleteToggleModal();
                              setDeleteId(item.id);
                            }}
                            className="ml-5"
                          >
                            <RiDeleteBinLine
                              size={25}
                              className="text-red-500"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                    : !isLoading && (
                      <tr className="bg-gray-600 border-b hover:bg-gray-50 ">
                        <td className="px-6">
                          <FaRegFolderOpen size={50} />
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && data && data.object ? (
          <ReactPaginate
            className="flex gap-3 navigation mt-5"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={data && data.totalPage}
            previousLabel="<"
            renderOnZeroPageCount={null}
            forcePage={page}
          />
        ) : null}
      </div>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div className="sm:w-96 w-full">
            <div className="w-80 sm:w-full">
              {/* <Input type="file" label="Rasm" onChange={handleImageChange} /> */}
              <Input
                label="To'liq F I"
                onChange={(e) => setAll({ ...all, fullName: e.target.value })}
                value={all.fullName}
              />
              <Input
                label="Telefon raqam"
                type="text"
                onChange={(e) => {
                  setAll({
                    ...all,
                    phoneNumber: e.target.value.replace(/[^0-9+]/g, ''),
                  });
                }}
                value={
                  all.phoneNumber ? all.phoneNumber.replace(/[^0-9+]/g, '') : ''
                }
              />
              <div className="relative">
                <Input
                  label="Parol"
                  type={togglePassword ? 'text' : 'password'}
                  onChange={(e) => setAll({ ...all, password: e.target.value })}
                  value={all.password}
                />
                <span className="absolute right-4 top-10">
                  {!togglePassword ? (
                    <button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setTogglePassword(!togglePassword);
                      }}
                    >
                      <FaEye size={25} />
                    </button>
                  ) : (
                    <button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setTogglePassword(!togglePassword);
                      }}
                    >
                      <FaEyeSlash size={25} />
                    </button>
                  )}
                </span>
              </div>
            </div>
            <div className="w-full flex justify-end gap-5">
              <Button onClick={toggleModal} color="red">
                Yopish
              </Button>
              <Button
                disabled={validate() || postIsloading}
                onClick={handleClick}
                color="green"
              >
                {postIsloading ? 'Loading...' : 'Saqlash'}
              </Button>
            </div>
          </div>
        }
      />
      <GlobalModal
        isOpen={editModal}
        onClose={editToggleModal}
        children={
          <div className="sm:w-96 w-full">
            <div>
              <Input onChange={handleImageChange} label="Rasm" type="file" />
              <Input
                label="Tuliq F I"
                onChange={(e) => setAll({ ...all, fullName: e.target.value })}
                value={all.fullName}
              />
              <Input
                label="Telefon raqam"
                type="text"
                onChange={(e) =>
                  setAll({
                    ...all,
                    phoneNumber: e.target.value.replace(/[^0-9+]/g, ''),
                  })
                }
                value={
                  all.phoneNumber ? all.phoneNumber.replace(/[^0-9+]/g, '') : ''
                }
              />
              <div className="relative">
                <Input
                  label="Parol"
                  type={togglePassword ? 'text' : 'password'}
                  onChange={(e) => setAll({ ...all, password: e.target.value })}
                  value={all.password}
                />
                <span className="absolute right-4 top-10">
                  {!togglePassword ? (
                    <button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setTogglePassword(!togglePassword);
                      }}
                    >
                      <FaEye size={25} />
                    </button>
                  ) : (
                    <button
                      onClick={(e: any) => {
                        e.preventDefault();
                        setTogglePassword(!togglePassword);
                      }}
                    >
                      <FaEyeSlash size={25} />
                    </button>
                  )}
                </span>
              </div>
            </div>
            <div className="w-full flex justify-end gap-5">
              <Button onClick={editToggleModal} color="red">
                yopish
              </Button>
              <Button
                disabled={putIsLoading || imageUpdateLoading || validate()}
                onClick={handleEdit}
                color="green"
              >
                {putIsLoading || imageUpdateLoading
                  ? 'Loading...'
                  : 'Tahrirlash'}
              </Button>
            </div>
          </div>
        }
      />
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        onConfirm={handleDelete}
        isLoading={deleteIsLoading}
      />
    </>
  );
};

export default Employees;
