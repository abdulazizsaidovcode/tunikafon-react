import { useEffect, useState } from 'react';
import usePost from '../../hooks/post';
import axios from '../../service/api';
import { toast } from 'sonner';
import useGet from '../../hooks/get';
import { Button } from '@material-tailwind/react';

interface DetailAddModalProps {
  onClose: () => void;
}
type AddData = {
  name: string;
  attachmentId: number;
  detailCategoryId: number | string;
  measure: string | number;
  price: number;
  description: string;
  width: number;
  height: number;
  largeDiagonal: number;
  smallDiagonal: number;
  side: string | null;
  detailTypeStatus: string;
};

const detailTypeStatus = [
  { value: 'HOVUZ_ROMB', name: 'Hovuz Romb' },
  { value: 'HOVUZ_LAMPA', name: 'Hovuz Lampa' },
  { value: 'HOVUZ_LENTA', name: 'Hovuz Lenta' },
  { value: 'HOVUZ_YULDUZCHA', name: 'Hovuz Yulduzcha' },
  { value: 'LAMPA', name: 'Lampa' },
  { value: 'HOVUZ_YONI_KAPALAK', name: 'Hovuz Yoni Kapalak' },
  { value: 'HOVUZ_YONI', name: 'Hovuz Yoni' },
  { value: 'HOVUZ_YONI_TUNIKA', name: 'Hovuz Yoni Tunika' },
  { value: 'HOVUZ_YONI_TUNIKA_BEZAK', name: 'Hovuz Yoni Tunika Bezak' },
  { value: 'HOVUZ_YONI_TUNIKA_DETAIL', name: 'Hovuz Yoni Tunika Detail' },
];

export default function DetailAddModal({ onClose }: DetailAddModalProps) {
  const [addModal, setAddModal] = useState<boolean>(false);
  const addToggleModal = () => setAddModal(!addModal);
  const { get, data } = useGet();
  const [addData, setAddData] = useState<AddData>({
    name: '',
    attachmentId: 0,
    detailCategoryId: '',
    measure: '',
    price: 0,
    description: '',
    width: 0,
    height: 0,
    largeDiagonal: 0,
    smallDiagonal: 0,
    side: null,
    detailTypeStatus: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { post, isLoading: postIsLoading } = usePost();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      !!file &&
      !!addData.name &&
      !!addData.detailCategoryId &&
      !!addData.measure &&
      !!addData.price;
  
    setIsFormValid(isValid);
  }, [addData, file]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', file!);

      const { data } = await axios.post(`/attachment/upload`, formData);

      await post('/detail', {
        ...addData,
        attachmentId: data.body,
        detailCategoryId: +addData.detailCategoryId,
        width: addData.width ? +addData.width : null,
        height: addData.height ? +addData.height : null,
        largeDiagonal: addData.largeDiagonal ? +addData.largeDiagonal : null,
        smallDiagonal: addData.smallDiagonal ? +addData.smallDiagonal : null,
        side: addData.side ? addData.side : null,
        detailTypeStatus: addData.detailTypeStatus,
      });

      toast.success('Successfully created');
      setIsLoading(false);
      setAddData({
        name: '',
        attachmentId: 0,
        detailCategoryId: '',
        measure: '',
        price: 0,
        description: '',
        width: 0,
        height: 0,
        largeDiagonal: 0,
        smallDiagonal: 0,
        side: null,
        detailTypeStatus: '',
      });
      onClose();
    } catch (error) {
      toast.error('Error creating detail');
      setIsLoading(false);
    }
  };


  useEffect(() => {
    get('/detail-category/list');
  }, []);

  return (
    <div>
      <div className="p-4">
        <h2 className="text-xl lg:w-[600px] min-w-full mb-4">Detal Kiritish</h2>
        <label className="block mb-2">Detal nomi</label>
        <input
          type="text"
          name="name"
          onChange={(e) => setAddData({ ...addData, name: e.target.value })}
          value={addData.name}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Detal categoriya</label>
        <select
          className="w-full rounded px-1 py-2 outline-none"
          onChange={(e) =>
            setAddData({
              ...addData,
              detailCategoryId: parseInt(e.target.value),
            })
          }
          value={addData.detailCategoryId}
        >
          <option selected >Categoriya tanlash</option>
          {data ? (
            data.object.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option>Loading...</option>
          )}
        </select>
        <label className="block my-2">Turi</label>
        <select
          className="w-full rounded px-1 py-2 outline-none"
          onChange={(e) =>
            setAddData({
              ...addData,
              detailTypeStatus: e.target.value,
            })
          }
          value={addData.detailTypeStatus}
        >
          <option selected>Turini tanlash</option>
          {detailTypeStatus.map((item: any) => (
            <option key={item.id} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="w-full">
            <label className="block mb-2">O'lchov</label>
            <select
              className="w-full rounded px-1 py-2"
              onChange={(e) =>
                setAddData({ ...addData, measure: e.target.value })
              }
              value={addData.measure}
            >
              <option selected>O'lchov belgilash</option>
              <option value="DONA">Dona</option>
              <option value="METER">Meter</option>
              <option value="SM">Sm</option>
            </select>
          </div>
        </div>
        <label className="block mb-2">Eni</label>
        <input
          type="number"
          name="width"
          onChange={(e) =>
            setAddData({ ...addData, width: parseFloat(e.target.value) })
          }
          value={addData.width}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Buyi</label>
        <input
          type="number"
          name="height"
          onChange={(e) =>
            setAddData({ ...addData, height: parseFloat(e.target.value) })
          }
          value={addData.height}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Katta Diagonal</label>
        <input
          type="number"
          name="largeDiagonal"
          onChange={(e) =>
            setAddData({
              ...addData,
              largeDiagonal: parseFloat(e.target.value),
            })
          }
          value={addData.largeDiagonal}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Kichik Diagonal</label>
        <input
          type="number"
          name="smallDiagonal"
          onChange={(e) =>
            setAddData({
              ...addData,
              smallDiagonal: parseFloat(e.target.value),
            })
          }
          value={addData.smallDiagonal || " "}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Tomoni</label>
        <input
          type="number"
          name="side"
          onChange={(e) => setAddData({ ...addData, side: e.target.value })}
          value={addData?.side || ' '}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Narxi</label>
        <input
          type="number"
          name="price"
          onChange={(e) =>
            setAddData({ ...addData, price: parseFloat(e.target.value) })
          }
          value={addData.price}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Tavsif</label>
        <input
          type="text"
          name="description"
          onChange={(e) =>
            setAddData({ ...addData, description: e.target.value })
          }
          value={addData.description}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Rasm</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 mb-4 border rounded"
          accept='.png, .jpg'
        />
        <div className="flex justify-end gap-5">
          <Button color="red" onClick={onClose}>
            Chiqish
          </Button>
          <Button
            disabled={isLoading || !isFormValid}
            onClick={handleClick}
            color="green"
          >
            {isLoading || postIsLoading ? 'Loading...' : 'Saqlash'}
          </Button>
        </div>
      </div>
    </div>
  );
}
