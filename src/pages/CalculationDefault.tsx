import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useGet from '../hooks/get';
import { attechment } from '../service/urls';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import {
  Menu,
  MenuHandler,
  Option,
} from '@material-tailwind/react';
import usePost from '../hooks/post';
import { toast } from 'sonner';
import { FaLeftLong, FaRegFolderOpen } from 'react-icons/fa6';
import { RiShareForwardFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Button } from '../components/Button';
import { MenuItem, MenuList } from '../components/Menu';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '../components/Accordion';

const CalculationDefault = () => {
  // const { get, isLoading, data } = useGet();
  // const { get: getProductDetail, data: productdetail } = useGet();
  const { get: getcategoryDetail, data: categorydetail } = useGet();
  const { get: getDetailCategory, data: detailCategory } = useGet();
  const { get: getGroup, data: groups, isLoading: groupIsloading } = useGet();
  const { post, data: total, error: totalError } = usePost();
  const { post: save, isLoading: saveLoading } = usePost();
  const [kvData, setKvData] = useState<any>(null);
  const [req, setReq] = useState<any>({
    width: null,
    tall: null,
  });
  const [orderData, setOrderData] = useState<any>({
    date: null,
    address: null,
    location: null,
    clientFullName: null,
    clientPhoneNumber: null,
  });
  const [toggle, setToggle] = useState(false);
  const [open, setOpen] = useState(0);
  const [gropusId, setGropusId] = useState<any>([]);
  const [groupssName, setGroupssName] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(total);
  const [orderProductStatus, setOrderProductStatus] = useState(
    'THE_GATE_IS_INSIDE_THE_ROOM',
  );
  const [orderProductDto, setOrderProductDto] = useState<any>([
    {
      orderDetails: [],
      width: 0,
      height: 0,
      dropOffTwo: 0,
      dropOffOne: 0,
      howManySidesOfTheHouseAreMade: 0,
      orderProductStatus: 'THE_GATE_IS_INSIDE_THE_ROOM',
    },
  ]);

  const handleOpen = (value: any) => {
    getDetailCategoryDetail(value);
    setOpen(open === value ? 0 : value);
  };

  console.log("detailCategorydetailCategorydetailCategorydetailCategorydetailCategory ", detailCategory);


  useEffect(() => {
    getDetailCategory(`detail-category/all/list`)
  }, []);

  useEffect(() => {
    if (total) {
      setKvData(total);
    } else if (totalError) {
      setKvData(null);
    }
  }, [total]);
  const toggleModal = () => {
    setKvData(null);
    setToggle(!toggle);
    resetAll();
  };
  const formatHovuz = (residual: any) => {
    return residual?.replace(/\d+\.\d+/g, (match: any) => {
      return parseFloat(match)
        .toString()
        .match(/^-?\d+(?:\.\d{0,4})?/)?.[0] ?? '0';
    }) ?? '';
  };

  const handleCheckboxChange = (item: any, index: number) => {
    setOrderProductDto((prevState: any) => {
      return prevState.map((product: any, i: number) => {
        if (index === i) {
          const isSelected = product.orderDetails.some(
            (detail: any) => detail.detailId === item.id,
          );

          if (isSelected) {
            return {
              ...product,
              orderDetails: product.orderDetails.filter(
                (detail: any) => detail.detailId !== item.id,
              ),
            };
          } else {
            return {
              ...product,
              orderDetails: [
                ...product.orderDetails,
                {
                  detailId: item.id,
                  name: item.name,
                  attachmentId: item.attachmentId,
                  count: 0,
                  number: item.row,
                  color: '',
                },
              ],
            };
          }
        }
        return product;
      });
    });
  };
  const formatNumberWithSpaces = (number: number | null) => {
    return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  const addDetail = (item: any, index: number) => {
    setOrderProductDto((prevState: any) => {
      return prevState.map((product: any, i: number) => {
        if (index === i) {
          return {
            ...product,
            orderDetails: [
              ...product.orderDetails,
              {
                detailId: item.id,
                name: item.name,
                attachmentId: item.attachmentId,
                count: 0,
                number: 0,
                color: '',
              },
            ],
          };
        }
        return product;
      });
    });
  };

  const removeDetail = (id: number, index: number) => {
    setOrderProductDto((prevOrderProductDto: any) => {
      return prevOrderProductDto.map((product: any, i: number) => {
        if (index === i) {
          return {
            ...product,
            orderDetails: product.orderDetails.filter(
              (_: any, state: number) => state !== id,
            ),
          };
        }
        return product;
      });
    });
  };
  const handleInputChange = (
    id: number,
    index: number,
    field: 'count' | 'number' | 'color',
    value: string,
  ) => {
    setOrderProductDto((prev: any) => {
      return prev.map((product: any, i: number) => {
        if (index === i) {
          return {
            ...product,
            orderDetails: product.orderDetails.map((data: any, idx: number) => {
              if (id === idx) {
                return {
                  ...data,
                  [field]:
                    field === 'count' || field === 'number' ? +value : value,
                };
              }
              return data;
            }),
          };
        }
        return product;
      });
    });
  };

  const handleChange = (
    index: number,
    field: 'width' | 'height' | 'howManySidesOfTheHouseAreMade' | 'dropOffOne' | `dropOffTwo`,
    value: number,
  ) => {
    setOrderProductDto((prev: any) => {
      return prev.map((product: any, i: number) => {
        if (index === i) {
          return {
            ...product,
            [field]: value,
          };
        }
        return product;
      });
    });
  };

  const handleSelectType = (index: number, value: string) => {
    setOrderProductDto((prev: any) => {
      return prev.map((product: any, i: number) => {
        if (index === i) {
          return {
            ...product,
            orderProductStatus: value,
          };
        }
        return product;
      });
    });
  };


  const resetAll = () => {
    setReq({ width: null, tall: null });
    setOrderData({
      date: null,
      address: null,
      location: null,
      clientFullName: null,
      clientPhoneNumber: null,
    });
    setGropusId([]);
    setGroupssName([]);
    setOrderProductDto([
      {
        orderDetails: [],
        width: 0,
        height: 0,
        howManySidesOfTheHouseAreMade: 0,
        orderProductStatus: 'THE_GATE_IS_INSIDE_THE_ROOM',
      },
    ]);
    setTotalPrice(0);
  };

  const handleClick = async (isClose?: boolean) => {
    const areDimensionsValid = orderProductDto.every(
      (product: any) => product.width > 0 && product.height > 0,
    );
    try {
      if (!areDimensionsValid) throw new Error('Malumotlar tuliq emas');
      await post('/order/calculation', orderProductDto);
      setTotalPrice(total);
      isClose && toggleModal();
    } catch (error) {
      toast.error('Hisoblashda xatolik yuz berdi');
    }
  };
  const validate = () => {
    const areDimensionsValid = orderProductDto.every(
      (product: any) => product.width > 0 && product.height > 0,
    );
    if (
      !areDimensionsValid ||
      !orderData.address ||
      !orderData.date ||
      !orderData.clientPhoneNumber ||
      !orderData.clientFullName ||
      !orderData.location ||
      !gropusId.length
    )
      return true;
    return false;
  };

  const handleSave = async () => {
    try {
      if (validate()) throw new Error('Barcha malumotlarni kiriting');

      await save('/order/save', {
        width: +req.width,
        tall: +req.tall,
        address: orderData.address,
        date: orderData.date,
        productAttachmentId: 0,
        orderProductDto,
        clientPhoneNumber: orderData.clientPhoneNumber,
        clientFullName: orderData.clientFullName,
        location: orderData.location,
        groupIds: gropusId,
      });
      resetAll();
      setToggle(false);

      toast.success('Malumotlaringiz kiritildi!');
    } catch (error) {
      toast.error('Malumotlaringizni yuklashda xatolik yuz berdi');
    }
  };

  const removeOrderProduct = (index: number) => {
    setOrderProductDto(
      orderProductDto.filter((_: any, i: number) => i !== index),
    );
  };

  useEffect(() => {
    // get('/product/all');
    getGroup('/group/all');
  }, []);

  const getDetailCategoryDetail = async (id: number) => {
    await getcategoryDetail(`detail/for/detail/category/${id}`);
  };

  const sortGroups = (item: any) => {
    if (gropusId.includes(item.id)) {
      const updatedGroupsId = gropusId.filter((id: number) => id !== item.id);
      const updatedGroupsName = groupssName.filter(
        (name: any) => name.id !== item.id,
      );
      setGroupssName(updatedGroupsName);
      setGropusId(updatedGroupsId);
    } else {
      setGropusId([...gropusId, item.id]);
      setGroupssName([...groupssName, item]);
    }
  };
  // console.clear();
  console.log('abd', orderProductDto[0].orderDetails)
  return (
    <>
      <Breadcrumb pageName="Hisoblash" />
      <div>
        <div className="w-full p-4 bg-white rounded-lg border-stroke shadow-default">
          {detailCategory && (
            <div className="flex justify-between items-center border-b border-[#64748B] pb-2 mb-4">
              <h2 className="text-lg">Detal kategoriya</h2>
              <div className="flex gap-5">
                <button
                  onClick={() =>
                    setOrderProductDto([
                      ...orderProductDto,
                      {
                        orderDetails: [],
                        width: 0,
                        height: 0,
                        howManySidesOfTheHouseAreMade: 0,
                        orderProductStatus: 'THE_GATE_IS_INSIDE_THE_ROOM',
                      },
                    ])
                  }
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}
          {orderProductDto &&
            orderProductDto.map((item: any, index: number) => (
              <div className="border rounded-lg p-2 my-5" key={item.id}>
                <div className="flex justify-between items-center ">
                  <div className="w-72 mb-5">
                    <Select
                      value={orderProductDto[index]?.orderProductStatus || ''}
                      onChange={(val: any) => handleSelectType(index, val)}
                    >
                      <Option value="EXTERIOR_VIEW_OF_THE_HOUSE">
                        Uyning tashqi ko'rinishi
                      </Option>
                      <Option
                        className="my-1"
                        value="INTERIOR_VIEW_OF_THE_HOUSE"
                      >
                        Uyning ichki ko'rinishi
                      </Option>
                      <Option value="THE_GATE_IS_INSIDE_THE_ROOM">
                        Darvoza xona
                      </Option>
                      <Option value="THE_RAGEL">RAGEL</Option>
                    </Select>
                  </div>
                  <button
                    disabled={orderProductDto.length <= 1}
                    onClick={() => removeOrderProduct(index)}
                  >
                    <MdDelete
                      size={32}
                      className={
                        orderProductDto.length <= 1
                          ? 'text-red-500/50 cursor-not-allowed'
                          : 'text-red-500'
                      }
                    />
                  </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-10 mb-4">
                  {detailCategory ? (
                    <div className="w-full lg:w-1/2 h-[260px] md:h-[350px] overflow-y-auto">
                      {detailCategory.map((item: any) => (
                        <Accordion
                          key={item.id}
                          open={open === item.id}
                          className="mb-3"
                        >
                          <AccordionHeader
                            className="border w-full border-[#64748B] rounded-xl flex gap-10 items-center p-1 sm:p-"
                            onClick={() => handleOpen(item.id)}
                          >
                            <div className="flex gap-10 items-center sm:px-10">
                              <img
                                className="sm:w-11 sm:h-11 w-10 h-10 bg-cover object-cover rounded-xl "
                                src={
                                  item.attachmentId
                                    ? attechment + item.attachmentId
                                    : 'https:static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                                }
                                alt={item.name}
                              />
                              <div className="w-full flex pb-6 items-center rounded-lg mt-5 text-center py-2">
                                <h1 className="text-sm sm:text-lg">
                                  {item.name}
                                </h1>
                              </div>
                            </div>
                          </AccordionHeader>
                          <AccordionBody>
                            {categorydetail ? (
                              categorydetail.map((detail: any) => (
                                <div
                                  key={detail.id}
                                  className="flex items-center justify-between gap-3 sm:gap-10 border border-[#64748B] rounded-lg p-0 sm:px-5 sm:py-1 mb-4 mx-3"
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      className="bg-blue-gray-300 sm:w-6 sm:h-6"
                                      checked={
                                        orderProductDto &&
                                        Array.isArray(orderProductDto) &&
                                        orderProductDto.some(
                                          (
                                            product: any,
                                            productIndex: number,
                                          ) =>
                                            index === productIndex &&
                                            product.orderDetails.some(
                                              (d: any) =>
                                                d.detailId === detail.id,
                                            ),
                                        )
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(detail, index)
                                      }
                                    />

                                    <img
                                      className="w-10 h-10 bg-cover object-cover rounded-xl"
                                      src={
                                        detail.attachmentId
                                          ? attechment + detail.attachmentId
                                          : 'https:static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                                      }
                                      alt={detail.name}
                                    />

                                    <h1 className="text-sm sm:text-lg">
                                      {detail.name}
                                    </h1>
                                  </div>

                                  <div className="cursor-pointer flex gap-2">
                                    <button
                                      onClick={() => addDetail(detail, index)}
                                    >
                                      <FaPlus />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col justify-center items-center">
                                <h4 className="text-red-400 text-center">
                                  Detal topilmadi. Siz oldin detal
                                  qo'shishingiz kerak
                                </h4>
                                <Link
                                  to={'/detail'}
                                  className="flex gap-2 justify-center items-center"
                                >
                                  <h4 className="text-gray-700">
                                    Detal qo'shish
                                  </h4>
                                  <RiShareForwardFill />
                                </Link>
                              </div>
                            )}
                          </AccordionBody>
                        </Accordion>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full flex flex-col justify-center items-center">
                      <h4 className="text-red-400 text-center">
                        ❗Detal topilmadi. Siz oldin detal kategoriya
                        qo'shishingiz kerak
                      </h4>
                      <Link
                        to={'/categor-detail'}
                        className="flex gap-2 justify-center items-center border-b border-blue-700"
                      >
                        <h4 className="text-blue-700">
                          Detal kategoriya qo'shish
                        </h4>
                        <RiShareForwardFill />
                      </Link>
                    </div>
                  )}
                  {detailCategory && ( 
                    <div className="w-full lg:w-1/2 h-[350px] overflow-y-auto flex flex-col items-center gap-2 border border-[#64748B] rounded-lg p-5">
                      {item.orderDetails.length > 0 ? (
                        item.orderDetails.map((detail: any, i: number) => (
                          <div
                            key={detail.id}
                            className="flex flex-col lg:justify-between border border-[#64748B] rounded-lg px-5 py-2 w-full gap-3"
                          >
                            <div className="flex gap-2 items-center justify-start">
                              <img
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-cover object-cover rounded-xl"
                                src={
                                  detail.attachmentId
                                    ? attechment + detail.attachmentId
                                    : 'https:static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                                }
                                alt={detail.name}
                              />
                              <div className="flex-1 px-0">
                                <h1 className="text-sm sm:text-md text-center">
                                  {detail.name}
                                </h1>
                              </div>
                            </div>
                            <input
                              type="number"
                              placeholder="Ishlatiladigan soni"
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  index,
                                  'count',
                                  e.target.value,
                                )
                              }
                              className="rounded outline-none px-1 py-0.5"
                            />
                            <input
                              type="number"
                              placeholder="Tartib raqami"
                              className="rounded outline-none px-1 py-0.5"
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  index,
                                  'number',
                                  e.target.value,
                                )
                              }
                            />
                            <input
                              type="text"
                              placeholder="Rang"
                              className="rounded outline-none px-1 py-0.50"
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  index,
                                  'color',
                                  e.target.value,
                                )
                              }
                            />
                            <button
                              className=""
                              onClick={() => removeDetail(i, index)}
                            >
                              <FaMinus className="text-red-500" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="w-full flex flex-col justify-center items-center py-10">
                          <h1 className="text-gray-600 font-semibold text-lg text-center flex gap-2 items-center justify-center ">
                            <FaLeftLong className="hidden lg:block" />{' '}
                            <span>
                              Bu qismda siz tanlagan detallar ko'rinadi.
                            </span>
                          </h1>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:gap-5 xl:gap-0 justify-between py-5 items-center">
                  <div className="flex flex-col sm:flex-row sm:gap-5 w-full justify-center items-center xl:justify-start">
                    <Input
                      placeholder="Bo'yini kiriting"
                      onChange={(e: any) =>
                        handleChange(index, 'height', e.target.value)
                      }
                      value={orderProductDto[index]?.height || ''}
                      label="Bo'yi"
                      type="number"
                    />
                    <Input
                      placeholder="Enini kiriting"
                      onChange={(e: any) =>
                        handleChange(index, 'width', e.target.value)
                      }
                      value={orderProductDto[index]?.width || ''}
                      label="Eni"
                      type="number"
                    />
                    {orderProductDto[index]?.orderProductStatus ===
                      'THE_GATE_IS_INSIDE_THE_ROOM' ? null : (
                      <>
                        {orderProductDto[index]?.orderProductStatus ===
                          'THE_RAGEL' ? (
                          <>
                            <Input
                              placeholder="Balandlik bir"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
                                handleChange(
                                  index,
                                  'dropOffOne',
                                  +e.target.value,
                                )
                              }
                              value={orderProductDto[index]?.dropOffOne || ''}
                              label="Balandlik bir"
                              type="number"
                            />
                            <Input
                              placeholder="Balandlik ikki"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
                                handleChange(
                                  index,
                                  'dropOffTwo',
                                  +e.target.value,
                                )
                              }
                              value={orderProductDto[index]?.dropOffTwo || ''}
                              label="Balandlik ikki"
                              type="number"
                            />
                          </>
                        ) : (
                          <Input
                            placeholder="Uyning tomonlari"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleChange(
                                index,
                                'howManySidesOfTheHouseAreMade',
                                +e.target.value,
                              )
                            }
                            label="Tomon"
                            type="number"
                            value={
                              orderProductDto[index]
                                ?.howManySidesOfTheHouseAreMade || ''
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          <div className="flex flex-col items-start">
            <Button
              disabled={
                !orderProductDto.every(
                  (product: any) => product.width > 0 && product.height > 0,
                )
              }
              onClick={() => {
                handleClick(), false;
              }}
              className="bg-primary"
            >
              Hisoblash
            </Button>
            <br />
            <div className="overflow-x-auto">
              {kvData && (
                <div className="grid grid-cols-3 gap-2 items-start justify-between border-b border-gray-200 py-2 text-start">
                  <h2 className="text-sm font-bold text-gray-800">Nomi</h2>
                  <h2 className="text-sm font-bold text-gray-800">KV</h2>
                  <h2 className="text-sm font-bold text-gray-800">Soni</h2>
                </div>
              )}

              {kvData && (
                <div>
                  {kvData?.resOrderDetails?.map(
                    (item: {
                      id: number | string;
                      residual: string;
                      detailName: string;
                      detailKv: number;
                      amount: number;
                      amountType: number | string;
                    }) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-3 gap-2 items-start border-b border-gray-200 py-2 text-start"
                      >
                        <h2 className="text-sm text-gray-600">{item.detailName}</h2>
                        <h2 className="text-sm text-gray-600">
                          {item.detailKv ? item.detailKv.toFixed(5) : '-'}
                        </h2>
                        <h2 className="text-sm text-gray-600">
                          {item.amount && item.amount.toFixed(5)} {item.amountType || '0'}
                          <br />
                          {(item.residual?.slice(0, 5) === 'Hovuz' ||
                            item.residual?.slice(0, 3) === 'MDF') &&
                            formatHovuz(item.residual)}
                        </h2>
                      </div>
                    ),
                  )}
                </div>
              )}

              {kvData && (
                <div className="mt-4 underline text-start">
                  <h2 className="text-lg font-bold text-gray-800">
                    Yig'indi KV:{' '}
                    {kvData.resOrderDetails.reduce(
                      (acc: any, item: { detailKv: number }) => acc + (item.detailKv || 0),
                      0,
                    )}
                  </h2>
                </div>
              )}
            </div>

          </div>
          {/* orderProductDto end */}
          <div className="mb-4 flex border-t-2 mt-5 flex-col md:flex-row sm:gap-10 pt-5">
            <div className="w-full">
              <Input
                onChange={(e) =>
                  setOrderData((prevState: any) => ({
                    ...prevState,
                    clientFullName: e.target.value,
                  }))
                }
                value={
                  orderData.clientFullName ? orderData.clientFullName : ''
                }
                label="Mijoz F.I.O"
                placeholder="Mijoz tuliq ism sharfini kiriting"
              />
            </div>
            <div className="w-full">
              <Input
                onChange={(e) => {
                  const formattedPhoneNumber = e.target.value.replace(
                    /[^0-9+]/g,
                    '',
                  );
                  if (formattedPhoneNumber.length <= 13) {
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      clientPhoneNumber: formattedPhoneNumber,
                    }));
                  }
                }}
                value={
                  orderData.clientPhoneNumber
                    ? orderData.clientPhoneNumber.replace(/[^0-9+]/g, '')
                    : '+998'
                }
                label="Mijoz telifon raqami"
                placeholder="Mijoz telifon raqamini kiriting"
              />
            </div>
            <div className="w-full">
              <Input
                onChange={(e) =>
                  setOrderData((prevState: any) => ({
                    ...prevState,
                    location: e.target.value,
                  }))
                }
                value={orderData.location ? orderData.location : ''}
                label="Mijoz lokatsiyasi"
                placeholder="Mijoz lokatsitsiyasini kiriting"
              />
            </div>
          </div>
          <div className="mb-4 flex items-center flex-col sm:flex-row sm:gap-10">
            <div className="w-full">
              <Input
                placeholder="Manzilni kiriting"
                onChange={(e) =>
                  setOrderData((prevState: any) => ({
                    ...prevState,
                    address: e.target.value,
                  }))
                }
                value={orderData.address ? orderData.address : ''}
                label="Manzil"
              />
            </div>
            <div className="w-full">
              <Input
                onChange={(e) =>
                  setOrderData((prevState: any) => ({
                    ...prevState,
                    date: e.target.value,
                  }))
                }
                value={orderData.date ? orderData.date : 0}
                label="Sana"
                placeholder="Sanani kiriting"
                type="date"
              />
            </div>
            <div className="w-full mb-2">
              <h1 className="mb-2">Guruh</h1>
              <Menu
                dismiss={{
                  itemPress: false,
                }}
              >
                <MenuHandler>
                  <div className="w-full cursor-pointer rounded flex gap-2 border overflow-y-auto border-black text-black p-2 text-start font-normal">
                    {groupssName && groupssName.length
                      ? groupssName.map((item: any) => (
                        <p className="border rounded line-clamp-1">
                          {item.name}
                        </p>
                      ))
                      : 'Gruhni tanlang'}
                  </div>
                </MenuHandler>
                <MenuList className="z-[1000000] bg-white border relative max-h-50 w-60 sm:w-96 text-black">
                  {groups && !groupIsloading ? (
                    <>
                      {groups.map((item: any) => (
                        <MenuItem
                          onClick={() => sortGroups(item)}
                          key={item.id}
                          className="p-0 !bg-white !text-black active:bg-white/50 hover:bg-white/50 hover:text-black flex items-center w-full"
                        >
                          <label
                            htmlFor={item.id}
                            className="flex cursor-pointer items-center gap-2 p-2"
                          >
                            <Checkbox
                              color="blue"
                              ripple={false}
                              checked={gropusId.includes(item.id)}
                              id={item.id}
                              containerProps={{ className: 'p-0' }}
                              className="hover:before:content-none"
                            />

                            {item.name}
                          </label>
                        </MenuItem>
                      ))}
                    </>
                  ) : (
                    <MenuItem disabled>
                      {!groups ? (
                        <div>Malumot yuq</div>
                      ) : (
                        <div className="w-full flex justify-center">
                          <div
                            className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                          >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                              Loading....
                            </span>
                          </div>
                        </div>
                      )}
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button
              disabled={validate()}
              onClick={handleSave}
              className="bg-primary px-20"
            >
              Saqlash
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculationDefault;
